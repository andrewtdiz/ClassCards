<template>
  <div
    class="flex flex-col items-start relative"
    style="overflow-y: hidden; min-height: 100vh; overflow-x: hidden !important"
  >
    <router-link to="/main">Go to Bar</router-link>
    <div
      v-if="viewingHand != ''"
      class="absolute z-10 w-screen h-screen flex flex-col items-center justify-center"
    >
      <HandModal />
      <div
        @click="$store.dispatch('changeViewingHand', {handId: ''})"
        class="absolute w-full h-full bg-black bg-opacity-50"
      ></div>
    </div>
    <h1>Create User:</h1>
    <input
      @keydown.enter="addUser"
      class="input"
      type="text"
      v-model="userName"
    />
    <div
      v-for="(user, ind) in users"
      :key="ind + 600"
      class="ml-4 flex hover:bg-blue-100 px-3 py-1"
    >
      <img
        :src="user.userImage"
        alt=""
        class="h-6 w-6 rounded-full mr-2"
      />
      <button @click="changeUser({ id: user.id })">
        {{ user.name }}
      </button>
    </div>

    <div v-if="Object.keys(currentUser).length > 0">
      <h1>Create Deck:</h1>
      <input
        @keydown.enter="addDeck"
        class="block"
        type="text"
        v-model="deckName"
      />
      <div
        v-for="(deck, ind) in decks"
        :key="ind + 400"
        class="ml-4 flex mt-4"
      >
        <button @click="$store.dispatch('changeDeck', { id: deck.id })">{{ deck.name }}</button>

        <JoinDeckButton
          :deck="deck"
          :currentUser="currentUser"
          v-on:updateuser="updateUser($event)"
        />
        <AdminButton
          v-if="
            Array.isArray(currentUser.deckIds)
              ? currentUser.deckIds.includes(deck.id)
              : false
          "
          :deck="deck"
          :currentUser="currentUser"
          v-on:updatedeck="updateDeck($event)"
        />
      </div>
    </div>

    <h1 class="mb-12">Deck selected: {{ currentDeck.name }}</h1>
    
    <div v-if="Object.keys(currentDeck).length!=0 && currentDeck.tags!==undefined" class="w-full mb-12">
      <h1>Create Tag:</h1>
      <input
        @keydown.enter="addTag"
        class="block"
        type="text"
        v-model="tagName"
      />
      <div v-for="(tag,ind) in currentDeck.tags" :key="ind+600"
        @click="selectedTag = tag.id">
        <button class="button">{{tag.name}}</button>
        <div v-if="tag.id==selectedTag">
          <div v-for="(handId, ind2) in tag.handIdsOrder" :key="ind2+87">
            <BaseCard :tag="tag" :hand="hands.filter(hnd=>hnd.id==handId)[0]" :handTotal="tag.handIdsOrder.length"/>
          </div>
          
        </div>
      </div>
      <h1>Viewing tag: {{selectedTag}}</h1>
    </div>
    <div v-if="Object.keys(currentDeck).length!=0" class="w-full">
      <!-- <div
        class="flex items-center p-3 bg-white rounded w-1/2 mt-1"
      >
        <b-skeleton size="is-large" :active="loading"></b-skeleton>
      </div> -->
      <div
        @click="$store.dispatch('changeViewingHand', {handId: hand.id})"
        v-for="(hand, ind) in hands"
        :key="ind"
        class="cursor-pointer bg-white flex items-center justify-around hover:bg-gray-100 p-3 rounded w-1/2 mt-1"
      >
        <p
          :class="
            currentUser.likedHands.includes(hand.id) ? 'text-orange-500' : ''
          "
        >
          {{ hand.likeTotal }}
        </p>
        <p v-if="hand.userThumb!==undefined">
          {{ hand.cards.filter(card=>card.id==hand.userThumb)[0].front }}, {{ hand.cards.filter(card=>card.id==hand.userThumb)[0].back }},
          {{ dateFormater(hand.dateCreated) }}
        </p>
        <p v-else>
          {{ hand.cards[0].front }}, {{ hand.cards[0].back }},
          {{ dateFormater(hand.dateCreated) }}
        </p>
        <LikeHandButton
          :hand="hand"
          :currentUser="currentUser"
          @addhandlike="addHandLike($event)"
          @removehandlike="removeHandLike($event)"
        />
        <button class="button" v-for="(tag,ind2) in currentDeck.tags" @click.stop="editDeckTag({handId: hand.id, tagId: tag.id})" :key="ind2+60">{{tag.name}}</button>
      </div>
    </div>
    <p class="mt-12">Front</p>
    <input class="block" type="text" v-model="front" />
    <p>Back</p>
    <input
      @keydown.enter="addHand"
      type="text"
      v-model="back"
      class="block"
    />
    <button @click="addHand">Send</button>
  </div>
</template>

<script>
import CommentContent from "../components/commentcontent.vue";
import HandModal from "../components/HandModal.vue";
import AdminButton from "../components/Buttons/AdminButton";
import JoinDeckButton from "../components/Buttons/JoinDeckButton";
import LikeHandButton from "../components/Buttons/LikeHandButton";
import BaseCard from "../components/BaseCard";

import graphQL from "../util/graphql";
import { getCardsByHand, getCards } from "../graphql/queries/Cards";
import { getHands } from "../graphql/queries/Hands";
import { getDeckByID, getDecks } from "../graphql/queries/Decks";
import { getCardCommentsByHand } from "../graphql/queries/CardComments";
import { getHandReviewsByUser } from "../graphql/queries/HandReviews";

import addCard from "../graphql/mutations/Cards";
import addHand from "../graphql/mutations/Hands";
import { addDeck, updateAdmin, updateDeck } from "../graphql/mutations/Decks";
import {
  addUser,
  editUserDeckIds,
  updateUser,
} from "../graphql/mutations/Users";
import addHandReview from "../graphql/mutations/HandReviews";

import { formatDistance } from "date-fns";

export default {
  data() {
    return {
      cards: [],
      likedHands: [],
      front: "",
      back: "",
      deckName: "",
      userName: "",
      tagName: "",
      cardComment: "",
      selectedTag: "",
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    users() {
      return this.$store.getters.getUsers;
    },
    decks() {
      return this.$store.getters.getDecks;
    },
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
    hands() {
      return this.$store.getters.getHands;
    },
    viewingHand() {
      return this.$store.getters.getViewingHand;
    },
  },
  components: {
    CommentContent,
    AdminButton,
    JoinDeckButton,
    LikeHandButton,
    HandModal,
    BaseCard
  },
  watch: {
    currentDeck() {
      this.$store.dispatch('getHands')
    },
  },
  created() {
    this.$store.dispatch("getUsers");
    this.$store.dispatch("getDecks")
  },
  methods: {
    editDeckTag({handId, tagId}) {
      let tagHold = this.currentDeck.tags.filter(tag=>tag.id==tagId)[0]
      if(tagHold.handIdsOrder.includes(handId)) {
        return
      } else {
        tagHold.handIdsOrder.push(handId)
        this.$store.dispatch('editDeckTag', {id: tagHold.id, handIdsOrder: tagHold.handIdsOrder})
      }
    },
    addTag() {
      let tagHold = this.tagName
      this.tagName = ""
      this.$store.dispatch('addDeckTag', {name: tagHold})
    },
    changeUser({id}) {
      this.$store.dispatch('changeUser', { id })
    },
    async updateDeck(id) {
      var temp = await graphQL
        .performOperation(updateDeck, {
          deckId: id,
        })
        .then((res) => {
          for (let i = 0; i < this.decks.length; i++) {
            if (this.decks[i].id == id) {
              this.$set(
                this.decks[i],
                "adminIds",
                res.data.data.updateDeck.adminIds
              );
              return;
            }
          }
        });
    },
    async getHands() {
      this.hands = [];
      var temp = await graphQL
        .performOperation(getHands, {
          deckId: this.currentDeck.id,
        })
        .then((res) => {
          this.hands = res.data.data.hands;
        });
    },
    async getCardsByHand() {
      var temp = await graphQL.performOperation(getCardsByHand, {
        handId: this.viewingHand,
      });
      this.cards = temp.data.data;
    },
    async getHandReviewsByUser() {
      var temp = await graphQL
        .performOperation(getHandReviewsByUser, {
          handId: this.viewingHand,
          userId: this.currentUser.id,
        })
        .then((res) => {
          for (let i = 0; i < this.hands.length; i++) {
            if (this.hands[i].id == this.viewingHand)
              this.$set(this.hands[i], "reviews", res.data.data.handreviews);
          }
        });
    },
    async getCardCommentsByHand() {
      var temp = await graphQL.performOperation(getCardCommentsByHand, {
        handId: this.viewingHand,
      });
      for (let i = 0; i < this.hands.length; i++) {
        if (this.hands[i].id == this.viewingHand)
          this.hands[i].comments = temp.data.data.cardcomments;
      }
    },
    dateFormater(cardDate) {
      cardDate = Date.parse(cardDate);
      if (cardDate) {
        cardDate = formatDistance(cardDate, new Date(), { addSuffix: true });
        cardDate = cardDate
          .split(" ")
          .filter((val) => val != "about")
          .join(" ");
        return cardDate;
      }
      return "";
    },
    async getHandLikes() {
      var temp = await graphQL
        .performOperation(getHandLikes, { userId: this.currentUser.id })
        .then((res) => {
          this.currentUser.likedHands = res.data.data.handlike.map(
            (val) => val.handId
          );
        });
    },
    async addCard(handId) {
      const frontHold = this.front;
      const backHold = this.back;
      this.front = "";
      this.back = "";
      var temp = await graphQL
        .performOperation(addCard, {
          front: frontHold,
          back: backHold,
          deckId: this.currentDeck.id,
          userId: this.currentUser.id,
          handId: handId,
        })
        .then(() => {});
      this.getHands();
    },
    async addCardComment() {
      const contentHold = this.cardComment;
      this.cardComment = "";
      var temp = await graphQL
        .performOperation(addCardComment, {
          content: contentHold,
          userId: this.currentUser.id,
          handId: this.viewingHand,
        })
        .then(() => {
          this.getCardCommentsByHand();
        });
    },
    async addHandLike(handId) {
      var temp = await graphQL.performOperation(addHandLike, {
        userId: this.currentUser.id,
        handId: handId,
        operation: 1,
      });
      this.likedHands.push(handId);
      this.hands.map((hand) => {
        if (hand.id == handId) hand.likeTotal++;
      });
    },
    async removeHandLike(handId) {
      var temp = await graphQL.performOperation(addHandLike, {
        userId: this.currentUser.id,
        handId: handId,
        operation: -1,
      });
      this.likedHands = this.likedHands.filter((val) => val != handId);
      this.hands.map((hand) => {
        if (hand.id == handId) hand.likeTotal--;
      });
    },
    async addHand() {
      const front = this.front;
      const back = this.back;
      this.front = "";
      this.back = "";
      this.$buefy.toast.open({
        message: `New card added!`,
        type: 'is-success'
      })
      this.$store.dispatch("addHand", {front, back})
      // this.getHands();
    },
    async addDeck() {
      const deckName = this.deckName;
      this.deckName = "";
      this.$store.dispatch("addDeck", {deckName});
    },
    async addUser() {
      const userName = this.userName;
      this.userName = "";
      var temp = await graphQL
        .performOperation(addUser, { name: userName, email: "test@gmail.com" })
        .then(() => {});
      this.$store.dispatch("getUsers");
    },
    updateLikedHands() {
      for (let i = 0; i < this.hands.length; i++) {
        this.$set(this.hands[i], "liked", false);
      }

      for (let i = 0; i < this.hands.length; i++) {
        if (this.likedHands.includes(this.hands[i].id)) {
          this.$set(this.hands[i], "liked", true);
        }
      }
    },
  },
};
</script>


<style>
.card {
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5 !important;
}

.b-skeleton + .b-skeleton {
  margin-top: 0rem !important;
}
</style>