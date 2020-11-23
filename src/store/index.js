import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { getUsers, getUserById } from "../graphql/queries/Users";
import { getDeckByID, getDecks } from "../graphql/queries/Decks";
import { getHands, getHandById } from "../graphql/queries/Hands";

import { editHandLike } from "../graphql/mutations/Users"
import { editUserDeckIds } from "../graphql/mutations/Users";
import editHandThumb from "../graphql/mutations/HandThumb";

import { updateAdmin } from "../graphql/mutations/Decks";
import { addDeck } from "../graphql/mutations/Decks";
import addHand from "../graphql/mutations/Hands";
import addCard from "../graphql/mutations/Cards";
import addCardComment from "../graphql/mutations/CardComments";
import addSubComment from "../graphql/mutations/SubComments";
import addHandReview from "../graphql/mutations/HandReviews";
import { addDeckTag, editDeckTag } from '../graphql/mutations/DeckTags';

import graphQL from "../util/graphql";

export default new Vuex.Store({
  state: {
    users: [],
    currentUser: {},
    decks: [],
    currentDeck: {},
    hands: [],
    handsPulled: false,
    viewingHand: "",
    viewingModal: "",
    contentLoaded: false,
  },
  getters: {
    getUsers(state) { return state.users },
    getCurrentUser(state) { return state.currentUser },
    getDecks(state) { return state.decks },
    getCurrentDeck(state) { return state.currentDeck },
    getHands(state) { 
      if(state.handsPulled==false) return []
      return state.hands
    },
    getViewingHand(state) { return state.viewingHand },
    getViewingModal(state) { return state.viewingModal },
    getContentLoaded(state) { return state.contentLoaded }
  },
  mutations: {
    changeModal(state, val) {
      state.viewingModal = val
    },
    setContentLoaded(state, val) {
      state.contentLoaded = val
    }
  },
  actions: {
    async getUsers({ state }) {
      var temp = await graphQL.performOperation(getUsers).then((res) => {
        res.data.data.user.forEach(val => {
          if(!state.users.map(user=>user.id).includes(val.id)) state.users.push(val)
        })
      })
    },
    async getDecks({state}) {
      var temp = await graphQL.performOperation(getDecks).then((res) => {
        res.data.data.decks.forEach(val => {
          if(!state.decks.map(deck=>deck.id).includes(val.id)) state.decks.push(val)
        })
        state.decks = res.data.data.decks
      })
    },
    async getHands({ state }) {
      var temp = await graphQL.performOperation(getHands, {deckId: state.currentDeck.id}).then((res) => {
        let handsHold = res.data.data.hands.map(hand => {
          for(let i=0; i<state.currentUser.userThumbs.length;i++) {
            if(state.currentUser.userThumbs[i].handId==hand.id) {
              hand.userThumb = state.currentUser.userThumbs[i].cardId
            }
          }
          return hand
        })
        state.hands = handsHold
        state.handsPulled = true
      })
    },
    async changeUser({ state, dispatch }, {id}) {
      var temp = await graphQL.performOperation(getUserById, {
        userId: id,
      }).then((res) => {
        state.currentUser = res.data.data.userById
        // Not necessary for final production
        dispatch('getHands')
      });
    },
    async changeDeck({state, dispatch}, {id}) {
      var temp = await graphQL.performOperation(getDeckByID, {id, userId: state.currentUser.id}).then((res) => {
        state.currentDeck = res.data.data.deck
      })
    },
    async changeViewingHand({state}, {handId}) {
      if(handId=='') {
        state.viewingHand = ''
        return
      }
      state.viewingHand= 'loading'
      var temp = await graphQL.performOperation(getHandById, {handId, userId: state.currentUser.id}).then((res) => {
        let hand = res.data.data.hand
        for(let i=0; i<state.currentUser.userThumbs.length;i++) {
          if(state.currentUser.userThumbs[i].handId==handId) {
            hand.userThumb = state.currentUser.userThumbs[i].cardId
            break
          }
        }
        for(let i=0; i<state.hands.length;i++) {
          if(state.hands[i].id==handId) {
            state.hands.splice(i, 1, hand)
          }
        }
        
      }).then(()=> state.viewingHand = handId)
    },
    async editHandLike({ state }, {handId, operation}) {
      var temp = await graphQL.performOperation(editHandLike, {userId: state.currentUser.id, handId, operation}).then((res) => {
        Vue.set(state.currentUser, 'likedHands',  res.data.data.editHandLike.likedHands)
        for(let i =0; i<state.hands.length; i++) {
          if(state.hands[i].id==handId) Vue.set(state.hands[i], 'likeTotal',  state.hands[i].likeTotal+operation)
        }
      })
    },
    async editUserDeckIds({ state }, {deckId, operation}){
      var temp = await graphQL.performOperation(editUserDeckIds, {userId: state.currentUser.id, deckId, operation}).then((res) => {
        Vue.set(state.currentUser, 'deckIds',  res.data.data.editUserDeckIds.deckIds)
      })
    },
    async editAdminDeck({state}, {deckId, operation}) {
      var temp = await graphQL.performOperation(updateAdmin, {
        userId: state.currentUser.id,
        deckId,
        operation
      }).then((res) => {
        for(let i=0; i<state.decks.length;i++) {
          if(state.decks[i].id==deckId) Vue.set(state.decks[i], 'adminIds', res.data.data.updateDeckAdmin.adminIds)
        }
      })
    },
    async editDeckTag({state}, {id, parentTag, handIdsOrder}) {
      var temp = await graphQL.performOperation(editDeckTag, {
        id: id,
        parentTag: parentTag || undefined,
        handIdsOrder: handIdsOrder,
      }).then((res) => {
        for(let i=0; i<state.currentDeck.tags.length;i++) {
          if(state.currentDeck.tags[i].id==id) {
            state.currentDeck.tags.splice(i,1, res.data.data.editDeckTag)
          }
        }
      })
    },
    async addDeck({ state, dispatch }, {deckName, deckDescription, everyone, inviteOnly, usersEdit, anonymousPosting}) {
      var temp = await graphQL
        .performOperation(addDeck, { deckName, deckDescription, userId: state.currentUser.id, everyone, inviteOnly, usersEdit, anonymousPosting })
        .then((res) => {
          state.decks.push(res.data.data.addDeck)
          let holdId = state.currentUser.id
          dispatch('changeUser', {id: holdId})
        });
    },
    async addHand({state}, {front, back}) {
      var temp = await graphQL
        .performOperation(addHand, {
          front,
          back,
          deckId: state.currentDeck.id,
          userId: state.currentUser.id,
        })
        .then((res) => {
          let holdHand = res.data.data.addHand
          state.hands.push(holdHand)
        });
    },
    async addCard({state}, {handId, front, back}) {
      var temp = await graphQL
      .performOperation(addCard, {
        front,
        back,
        userId: state.currentUser.id,
        handId: handId,
        deckId: state.currentDeck.id
      })
        .then((res) => {
          for(let i=0; i<state.hands.length; i++) {
            if(state.hands[i].id==handId) {
              state.hands[i].cards.push(res.data.data.addCard)
              break
            }
          }
        });
    },
    async addCardComment({state}, {content}) {
      var temp = await graphQL
        .performOperation(addCardComment, {
          content,
          userId: state.currentUser.id,
          handId: state.viewingHand,
        }).then((res) => {
          for(let i =0; i<state.hands.length; i++) {
            if(state.hands[i].id==state.viewingHand) {
              let holdComments = state.hands[i].comments
              holdComments.push(res.data.data.addCardComment)
              Vue.set(state.hands[i], 'comments', holdComments)
            }
          }
        })
    },
    async addSubComment({state}, {content, comment}) {
      var temp = await graphQL
        .performOperation(addSubComment, {
          content,
          userId: state.currentUser.id,
          cardCommentId: comment.id,
        }).then((res) => {
          for(let i =0; i<state.hands.length; i++) {
            if(state.hands[i].id==state.viewingHand) {
              for(let j=0; j<state.hands[i].comments.length; j++) {
                let holdSubComments = state.hands[i].comments[j].subComments
                holdSubComments.push(res.data.data.addSubComment)
                if(state.hands[i].comments[j].id==comment.id) {
                  Vue.set(state.hands[i].comments[j], 'subComments', holdSubComments)
                  break
                }
              }
              break
            }
          }
        })
    },
    async addHandReview({state}, review) {
      var temp = await graphQL
        .performOperation(addHandReview, {
          review: review,
          userId: state.currentUser.id,
          handId: state.viewingHand,
        })
        .then((res) => {
          for(let i=0;i<state.hands.length;i++) {
            if(state.hands[i].id==state.viewingHand) {
              state.hands[i].reviews.push(res.data.data.addHandReview)
              break
            }
          }
        })
    },
    async addDeckTag({state}, {name, parentTag}) {
      var temp = await graphQL.performOperation(addDeckTag, {
        name,
        deckId: state.currentDeck.id,
        parentTag: parentTag || ''
      })
      .then((res) => {
       state.currentDeck.tags.push(res.data.data.addDeckTag)
      })
    },
    async editHandThumb({state}, id) {
      // If this is the default card, remove from array and DB
      if(state.hands.filter(hand=>hand.id==state.viewingHand)[0].defaultCard==id) {
        var temp = await graphQL.performOperation(editHandThumb, {
          userId: state.currentUser.id,
          handId: state.viewingHand,
          cardId: id,
          operation: -1
        }).then(() => {
          Vue.set(state.hands[state.hands.map(hand=>hand.id).indexOf(state.viewingHand)], 'userThumb', undefined)
          for(let i=0; i<state.currentUser.userThumbs.length;i++) {
            if(state.currentUser.userThumbs[i].handId==state.viewingHand) {
              state.currentUser.userThumbs.splice(i, 1)
              break
            }
          }
          
        })
        return
      }
      var temp = await graphQL
        .performOperation(editHandThumb, {
          userId: state.currentUser.id,
          handId: state.viewingHand,
          cardId: id,
        })
        .then((res) => {
          // If there is an alternate thumb replace it
          for(let i=0; i<state.currentUser.userThumbs.length;i++) {
            if(state.currentUser.userThumbs[i].handId==state.viewingHand) {
              Vue.set(state.hands[state.hands.map(hand=>hand.id).indexOf(state.viewingHand)], 'userThumb', id)
              state.currentUser.userThumbs.splice(i, 1, res.data.data.changeHandThumb)
              return
            }
          }
          // Otherwise add it to userThumbs
          Vue.set(state.hands[state.hands.map(hand=>hand.id).indexOf(state.viewingHand)], 'userThumb', id)
          state.currentUser.userThumbs.push(res.data.data.changeHandThumb)
        })
    },
  },
  modules: {
  }
})
