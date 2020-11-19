<template>
  <div class="mt-3">
    <article class="media">
      <figure class="media-left">
        <p class="image is-48x48">
          <img :src="users.filter((user) => user.id == comment.userId)[0].userImage" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{
              users.filter((user) => user.id == comment.userId)[0].name
            }}</strong>
            {{ comment.content }}
            <br />
            <small class="is-size-7"
              ><a class="hover:underline has-text-info">Like</a> ·
              <a
                @click="leaveComment = !leaveComment"
                class="hover:underline has-text-info"
                >Reply</a
              >
              ·
              <b-tooltip
                class="hover:underline cursor-pointer is-info"
                :label="dateFormaterTwo(comment.dateCreated)"
              >
                {{ dateFormater(comment.dateCreated) }}
              </b-tooltip></small
            >
          </p>
        </div>
        <article
          class="media"
          v-for="(subComment, ind) in comment.subComments"
          :key="ind + 200"
        >
          <figure class="media-left">
            <p class="image is-32x32">
              <img :src="users.filter((user) => user.id == subComment.userId)[0].userImage" />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{
                  users.filter((user) => user.id == subComment.userId)[0].name
                }}</strong>
                {{ subComment.content }}
                <br />
                <small class="is-size-7">
                  <b-tooltip
                    class="hover:underline cursor-pointer is-info"
                    :label="dateFormaterTwo(subComment.dateCreated)"
                  >
                    {{ dateFormater(subComment.dateCreated) }}
                  </b-tooltip>
                </small>
              </p>
            </div>
          </div>
          <div class="media-right" v-if="subComment.userId==currentUser.id">
            <button class="delete"></button>
          </div>
        </article>
      </div>
    </article>

    <div v-if="leaveComment" class="mt-2">
      <b-field horizontal label="Reply">
        <b-input
          @keydown.enter="addSubComment"
          v-model="subComment"
          type="text"
        ></b-input>
      </b-field>

      <b-field horizontal
        ><!-- Label left empty for spacing -->
        <p class="control">
          <button @click="addSubComment" class="button is-info is-small">
            Send message
          </button>
        </p>
      </b-field>
    </div>
  </div>
</template>

<script>
import graphQL from "../util/graphql";
import addSubComment from "../graphql/mutations/SubComments";
import { format } from "date-fns";

export default {
  name: "CommentContent",
  props: ["comment", "currentUser"],
  data() {
    return {
      leaveComment: false,
      subComment: "",
    };
  },
  computed: {
    users() {
      return this.$store.getters.getUsers;
    },
  },
  methods: {
    dateFormater(cardDate) {
      cardDate = Date.parse(cardDate);
      if (cardDate) {
        return format(cardDate, "h:hh aa");
      }
      return "";
    },
    dateFormaterTwo(cardDate) {
      cardDate = Date.parse(cardDate);
      if (cardDate) {
        return format(cardDate, "MMM, dd h:hh aa");
      }
      return "";
    },
    async addSubComment() {
      const contentHold = this.subComment;
      this.subComment = "";
      this.$store.dispatch("addSubComment", {
        content: contentHold,
        comment: this.comment,
      });
    },
  },
};
</script>

<style>
.media .media {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.media + .media {
  margin-top: 0rem !important;
}

.media-left {
  margin-right: 0.5rem !important;
}
</style>