<template>
  <div
    class="z-50 rounded w-3/4 p-12 bg-white overflow-y-scroll"
    style="max-height: 90vh"
  >
    <div v-if="viewingHand !== 'loading'" class="flex">
      <div class="w-full pr-8">
        <div class="w-full card mt-2">
          <div class="card-content">
            <p class="">
              {{ mainCard.front }},
              {{ mainCard.back }}
            </p>
          </div>
        </div>

        <div class="mt-12 field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Front</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input class="input" type="text" v-model="front" />
              </p>
            </div>
          </div>
        </div>
        <div class="mt-2 field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Back</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input
                  @keydown.enter="addCard(hand.id)"
                  class="input"
                  type="text"
                  v-model="back"
                />
              </p>
            </div>
          </div>
        </div>
        <button class="button" @click="addCard(hand.id)">Send</button>
        <div class="mt-4">
          <div class="flex">
            <div
              class="flex flex-col items-center w-24"
              @click="addHandReview(5)"
            >
              <button class="button ml-2 is-danger">Hard</button>
              <p class="is-size-7">5 min</p>
            </div>
            <div
              class="flex flex-col items-center w-24"
              @click="addHandReview(15)"
            >
              <button class="button ml-2 is-info">Medium</button>
              <p class="is-size-7">15 min</p>
            </div>
            <div
              class="flex flex-col items-center w-24"
              @click="addHandReview(1000)"
            >
              <button class="button ml-2 is-success">Easy</button>
              <p class="is-size-7">1 day</p>
            </div>
          </div>
        </div>
        <b-tabs
          :animated="false"
          type="is-boxed"
          class="mt-6 w-full overflow-x-hidden"
        >
          <b-tab-item>
            <template #header>
              <b-icon icon="card-outline"></b-icon>
              <span>
                Cards <b-tag rounded> {{ hand.cards.length - 1 }} </b-tag>
              </span>
            </template>
            <div v-if="otherCards.length==0">
                <p>No cards found</p>
            </div>
            <div v-else>
              <div
                class="card mt-4"
                v-for="(card, id) in otherCards"
                :key="id"
              >
                <div class="card-content cursor-pointer flex items-center">
                  <p>{{ card.front }}, {{ card.back }}</p>
                  <ReplaceButton :card="card" />
                </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item>
            <template #header>
              <b-icon icon="comment-outline"></b-icon>
              <span> Comments <b-tag rounded> {{hand.comments.length || 0}} </b-tag> </span>
            </template>
            <div class="w-full">
              <div v-if="hand.comments.length > 0" class="">
                <div
                  v-for="(comment, id) in hand.comments"
                  :key="id"
                  class="flex flex-col"
                >
                  <CommentContent
                    :comment="comment"
                    :currentUser="currentUser"
                  />
                </div>
              </div>
              <div class="mt-2">
                <b-field horizontal label="Comment">
                  <b-input
                    @keydown.enter="addCardComment(hand.id)"
                    type="text"
                    v-model="cardComment"
                  ></b-input>
                </b-field>

                <b-field horizontal
                  ><!-- Label left empty for spacing -->
                  <p class="control">
                    <button
                      @click="addCardComment(hand.id)"
                      class="button is-info is-small"
                    >
                      Add comment
                    </button>
                  </p>
                </b-field>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item>
            <template #header>
              <b-icon icon="calendar"></b-icon>
              <span>
                Reviews <b-tag rounded> {{ hand.reviews.length }} </b-tag>
              </span>
            </template>
            <div v-if="hand.reviews.length==0">
                <p>No reviews found</p>
            </div>
            <div v-else>
                <div
              v-for="(review, ind) in hand.reviews"
              :key="ind + 555"
              class="mt-1"
            >
             <b-tag>{{ review.review }} minutes -- {{ review.dateCreated }}</b-tag>
             
            </div>
            </div>
            
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <div v-else class="flex">
      <div class="w-full pr-8">
        <div class="card mt-2">
          <div class="card-content">
            <b-skeleton width="80%" :animated="true"></b-skeleton>
          </div>
        </div>
        <div>
          <p class="mt-12">Cards:</p>
          <div>
            <div class="card mt-2">
              <div class="card-content">
                <b-skeleton width="80%" :animated="true"></b-skeleton>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import CommentContent from "./commentcontent.vue";
import ReplaceButton from "./Buttons/ReplaceButton"


export default {
  data() {
    return {
      cardComment: "",
      front: "",
      back: "",
    };
  },
  components: {
    CommentContent,
    ReplaceButton
  },
  created() {},
  methods: {
    addHandReview(review) {
      this.$store.dispatch('addHandReview', review)
    },
    addCardComment(handId) {
      if (this.cardComment == "") return;
      const contentHold = this.cardComment;
      this.cardComment = "";
      this.$store.dispatch("addCardComment", { content: contentHold });
    },
    addCard(handId) {
      let frontHold = this.front
      let backHold = this.back
      this.front = ""
      this.back = ""
      this.$store.dispatch('addCard', {handId, front: frontHold, back: backHold})
    },
  },
  computed: {
    hands() {
      return this.$store.getters.getHands;
    },
    viewingHand() {
      return this.$store.getters.getViewingHand;
    },
    hand() {
      return this.$store.getters.getHands.filter(
        (hand) => hand.id == this.viewingHand
      )[0];
    },
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    mainCard() {
      console.log('in the checker', this.hand.userThumb)
      if(this.hand.userThumb!==undefined) {
        return this.hand.cards.filter(card=>card.id==this.hand.userThumb)[0]
      }
      console.log('should return: ', this.hand.cards[0])
      return this.hand.cards[0]
    },
    otherCards() {
      return this.hand.cards.filter(card=>card.id!==this.mainCard.id)
    },
  },
};
</script>

<style>
</style>