const graphql = require('graphql');
const Card = require('../models/card')
const Hand = require('../models/hand')
const User = require('../models/user')
const Deck = require('../models/deck')
const CardComment = require('../models/cardcomment')
const SubComment = require('../models/subcomment')
const HandReview = require('../models/handreview')
const UserThumb = require('../models/userthumb')
const DeckTag = require('../models/decktag')

const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const CardType = new GraphQLObjectType({
    name: 'Card',
    fields: () => ({
        id: { type: GraphQLID }, 
        front: { type: GraphQLString }, 
        back: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        deckId: { type: GraphQLString },
        userId: { type: GraphQLString },
        handId: { type: GraphQLString },
    })
})

const DeckType = new GraphQLObjectType({
    name: 'Deck',
    fields: () => ({
        id: { type: GraphQLID }, 
        name: { type: GraphQLString }, 
        dateCreated: { type: GraphQLString },
        deckDescription: {type: GraphQLString},
        everyone: {type: GraphQLBoolean},
        inviteOnly: {type: GraphQLBoolean},
        usersEdit: {type: GraphQLBoolean},
        anonymousPosting: {type: GraphQLBoolean},
        userIds: { type: new GraphQLList(GraphQLString) },
        adminIds: { type: new GraphQLList(GraphQLString) },
        hands: {
            type: new GraphQLList(CardType),
            resolve(parent, args){
                return Hand.find({deckId: parent.id})
            }
        },
        tags: {
            type: new GraphQLList(DeckTagType),
            resolve(parent, args){
                return DeckTag.find({deckId: parent.id})
            }
        },
        
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID }, 
        userImage: { type: GraphQLString }, 
        name: { type: GraphQLString }, 
        email: { type: GraphQLString }, 
        deckIds: { type: new GraphQLList(GraphQLString) }, 
        likedHands: { type: new GraphQLList(GraphQLString) }, 
        userThumbs: {
            type: new GraphQLList(UserThumbType),
            args: { userId: {type: GraphQLString} },
            resolve(parent,args) {
                return UserThumb.find({ userId: args.userId })
            }
        },
    })
})

const HandType = new GraphQLObjectType({
    name: 'Hand',
    fields: () => ({
        id: { type: GraphQLID }, 
        deckId: { type: GraphQLString }, 
        dateCreated: { type: GraphQLString }, 
        cardIds: { type: new GraphQLList(GraphQLString) },
        defaultCard: { type: GraphQLString }, 
        createdByUserId: { type: GraphQLString }, 
        commentTotal: { type: GraphQLInt },
        likeTotal: { type: GraphQLInt },
        cards: {
            type: new GraphQLList(CardType),
            resolve(parent,args) {
                return Card.find({handId: parent.id})
            }
        },
        comments: {
            type: new GraphQLList(CardCommentType),
            resolve(parent,args) {
                return CardComment.find({handId: parent.id})
            }
        },
        reviews: {
            type: new GraphQLList(HandReviewType),
            args: { userId: {type: GraphQLString}, handId: {type: GraphQLString} },
            resolve(parent,args) {
                return HandReview.find({userId: args.userId, handId: parent.id})
            }
        },
    })
})

const CardCommentType = new GraphQLObjectType({
    name: 'CardComment',
    fields: () => ({
        id: { type: GraphQLID }, 
        userId: { type: GraphQLString }, 
        content: { type: GraphQLString }, 
        handId: { type: GraphQLString }, 
        dateCreated: { type: GraphQLString }, 
        subComments: { 
            type: new GraphQLList(SubCommentType),
            resolve(parent, args) {
                return SubComment.find({cardCommentId: parent.id})
            }
        }
    })
})

const SubCommentType = new GraphQLObjectType({
    name: 'SubComment',
    fields: () => ({
        id: { type: GraphQLID }, 
        userId: { type: GraphQLString }, 
        content: { type: GraphQLString }, 
        cardCommentId: { type: GraphQLString }, 
        dateCreated: { type: GraphQLString }, 
    })
})

const HandReviewType = new GraphQLObjectType({
    name: 'HandReview',
    fields: () => ({
        id: { type: GraphQLID }, 
        userId: { type: GraphQLString }, 
        review: { type: GraphQLInt }, 
        handId: { type: GraphQLString }, 
        dateCreated: { type: GraphQLString }, 
    })
})

const UserThumbType = new GraphQLObjectType({
    name: 'UserThumb',
    fields: () => ({
        id: { type: GraphQLID }, 
        userId: { type: GraphQLString }, 
        cardId: { type: GraphQLString }, 
        handId: { type: GraphQLString },
        dateCreated: {type: GraphQLString}
    })
})

const DeckTagType = new GraphQLObjectType({
    name: 'DeckTag',
    fields: () => ({
        id: { type: GraphQLID }, 
        name: { type: GraphQLString },
        deckId: { type: GraphQLString }, 
        dateCreated: { type: GraphQLString }, 
        handIdsOrder: { type: new GraphQLList(GraphQLString) },
        parentTag: { type: GraphQLString }, 
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        card: {
            type: CardType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Card.findById(args.id)
            }
        },
        cards: {
            type: GraphQLList(CardType),
            args: {deckId: {type: GraphQLString}, handId: {type: GraphQLString}},
            resolve(parent, args) {
                if(args.deckId) return Card.find({deckId: args.deckId})
                return Card.find({handId: args.handId})
            }
        },
        hand: {
            type: HandType,
            args: { handId: {type: GraphQLString} },
            resolve(parent, args) {
                return Hand.findById(args.handId)
            }
        },
        hands: {
            type: GraphQLList(HandType),
            args: { deckId: {type: GraphQLString}, userId: {type: GraphQLString} },
            resolve(parent, args) {
                if(args.deckId) return Hand.find({deckId: args.deckId})
                return Hand.find({})
            }
        },
        user: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find()
            } 
        },
        userById: {
            type: UserType,
            args: {userId: {type: GraphQLString}},
            resolve(parent, args) {
                return User.findById(args.userId)
            } 
        },
        deck: {
            type: DeckType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Deck.findById(args.id)
            } 
        },
        decks: {
            type: GraphQLList(DeckType),
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Deck.find()
            } 
        },
        cardcomments: {
            type: GraphQLList(CardCommentType),
            args: { handId: {type: GraphQLString} },
            resolve(parent, args) {
                return CardComment.find({handId: args.handId})
            } 
        },
        subcomments: {
            type: GraphQLList(SubCommentType),
            args: { cardCommentId: {type: GraphQLString} },
            resolve(parent, args) {
                return SubComment.find({cardCommentId: args.cardCommentId})
            } 
        },
        handreviews: {
            type: GraphQLList(HandReviewType),
            args: { userId: {type: GraphQLString}, handId: {type: GraphQLString} },
            resolve(parent, args) {
                return HandReview.find({userId: args.userId, handId: args.handId})
            } 
        },
        decktags: {
            type: GraphQLList(DeckTagType),
            ars: {deckId: {type: GraphQLString}},
            resolve(parent, args) {
                return DeckTag.find({deckId: args.deckId})
            },
        }

    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCard: {
            type: CardType,
            args: {
                front: {type: GraphQLString},
                back: {type: GraphQLString},
                dateCreated: {type: GraphQLString},
                userId: {type: GraphQLString},
                handId: {type: GraphQLString},
                deckId: {type: GraphQLString}
            },
            resolve(parent,args) {
                let card = new Card({
                    front: args.front,
                    back: args.back,
                    userId: args.userId,
                    deckId: args.deckId,
                    handId: args.handId,
                    dateCreated: new Date(),
                })
                return card.save()
                
            }
        },
        addHand: {
            type: HandType,
            args: {
                deckId: { type: GraphQLString }, 
                handId: { type: GraphQLString }, 
                userId: { type: GraphQLString }, 
                front: { type: GraphQLString }, 
                back: { type: GraphQLString }, 
                dateCreated: { type: GraphQLString }, 
                cardIds: { type: new GraphQLList(GraphQLString) },
            },
            resolve(parent,args) {
                let card = new Card({
                    front: args.front,
                    back: args.back,
                    deckId: args.deckId,
                    userId: args.userId,
                    dateCreated: new Date(),
                    likeTotal: 0,
                })
                let holdId = card['_id']
                let hand = new Hand({
                    deckId: args.deckId, 
                    dateCreated: new Date(),
                    cardIds: [holdId],
                    defaultCard: holdId,
                    createdByUserId: args.userId,
                    commentTotal: 1,
                    likeTotal: 0,
                })
                card.handId = hand.id
                let result = card.save()
                return hand.save()
                
            }
        },
        addUser: {
            type: UserType,
            args: {
                name: {type: GraphQLString},
                email: {type: GraphQLString},
            },
            resolve(parent,args) {
                let user = new User({
                    name: args.name,
                    email: args.email,
                    deckIds: [],
                })
                return user.save()
            }
        },
        addDeck: {
            type: DeckType,
            args: {
                deckName: {type: GraphQLString},
                dateCreated: {type: GraphQLString},
                userId: { type: GraphQLString },
                deckDescription: { type: GraphQLString},
                everyone: { type: GraphQLBoolean},
                inviteOnly: { type: GraphQLBoolean},
                usersEdit: { type: GraphQLBoolean},
                anonymousPosting: { type: GraphQLBoolean},
            },
            resolve(parent,args) {
                let deck = new Deck({
                    name: args.deckName,
                    dateCreated: new Date(),
                    userIds: [args.userId],
                    adminIds: [args.userId],
                    deckDescription: args.deckDescription,
                    everyone: args.everyone,
                    inviteOnly: args.inviteOnly,
                    usersEdit: args.usersEdit,
                    anonymousPosting: args.anonymousPosting,
                })
                let hold = User.findOneAndUpdate({_id: args.userId}, {$push : {'deckIds' : deck.id}}, {new: true}).then((res) => {
                }).then((res) => {
                    let holdAdmin = Deck.findByIdAndUpdate(args.deckId, {$push : {'adminIds' : args.userId}}, {new: true})
                })
                return deck.save()
            }
        },
        addCardComment: {
            type: CardCommentType,
            args: {
                content: {type: GraphQLString},
                userId: {type: GraphQLString},
                handId: {type: GraphQLString}
            },
            resolve(parent,args) {
                let cardcomment = new CardComment({
                    content: args.content,
                    userId: args.userId,
                    dateCreated: new Date(),
                    handId: args.handId
                })
                let hold = Hand.findByIdAndUpdate(args.handId, {$inc : {'commentTotal' : 1}}, ).then((res)=> {
                })
                return cardcomment.save()
            }
        },
        addSubComment: {
            type: CardCommentType,
            args: {
                content: {type: GraphQLString},
                userId: {type: GraphQLString},
                cardCommentId: {type: GraphQLString}
            },
            resolve(parent,args) {
                let subcomment = new SubComment({
                    content: args.content,
                    userId: args.userId,
                    dateCreated: new Date(),
                    cardCommentId: args.cardCommentId
                })
                let hold = Hand.findByIdAndUpdate(args.handId, {$inc : {'commentTotal' : 1}}, ).then((res)=> {
                })
                return subcomment.save()
            }
        },
        addHandReview: {
            type: HandReviewType,
            args: {
                userId: {type: GraphQLString},
                handId: {type: GraphQLString},
                review: {type: GraphQLInt},
            },
            resolve(parent,args) {
                let handreview = new HandReview({
                    userId: args.userId,
                    handId: args.handId,
                    dateCreated: new Date(),
                    review: args.review
                })
                return handreview.save()
                
            }
        },
        addDeckTag: {
            type: DeckTagType,
            args: {
                name: {type: GraphQLString},
                deckId: {type: GraphQLString},
                parentTag: {type: GraphQLString}
            },
            resolve(parent,args) {
                console.log('testing if defined', args.parentTag || undefined)
                let decktag = new DeckTag({
                    name: args.name,
                    deckId: args.deckId,
                    handIdsOrder: [],
                    dateCreated: new Date(),
                    parentTag: args.parentTag || ''
                })
                console.log(decktag)
                return decktag.save()
            }
        },
        updateUser: {
            type: UserType,
            args: {
                userId: {type: GraphQLString},
            },
            resolve(parent,args) {
                return User.findById(args.userId)
            }
        },
        updateDeck: {
            type: DeckType,
            args: {
                deckId: {type: GraphQLString},
            },
            resolve(parent,args) {
                return Deck.findById(args.deckId)
            }
        },
        updateDeckAdmin: {
            type: DeckType,
            args: {
                userId: {type: GraphQLString},
                deckId: {type: GraphQLString},
                operation: {type: GraphQLInt}
            },
            resolve(parent,args) {
                if(args.operation==1) {
                    return Deck.findByIdAndUpdate(args.deckId, {$push : {'adminIds' : args.userId}}, {new: true})
                }
                return Deck.findByIdAndUpdate(args.deckId, {$pull : {'adminIds' : args.userId}}, {new: true})
            }
        },
        editHandLike: {
            type: UserType,
            args: {
                userId: {type: GraphQLString},
                handId: {type: GraphQLString},
                operation: {type: GraphQLInt}
            },
            resolve(parent,args) {
                let hold = Hand.findOneAndUpdate({_id: args.handId}, {$inc : {'likeTotal' : args.operation}}, {new: true}).then((res) => {
                })
                if(args.operation==1) {
                    return User.findByIdAndUpdate(args.userId, {$push : {'likedHands' : args.handId}}, {new: true})
                } 
                return User.findByIdAndUpdate(args.userId, {$pull : {'likedHands' : args.handId}}, {new: true})          
            }
        },
        editUserDeckIds: {
            type: UserType,
            args: {
                userId: {type: GraphQLString},
                deckId: {type: GraphQLString},
                operation: {type: GraphQLInt}
            },
            resolve(parent,args) {
                if(args.operation==1) {
                    let hold = Deck.findByIdAndUpdate(args.deckId, {$push : {'userIds' : args.userId}})
                    return User.findByIdAndUpdate(args.userId, {$push : {'deckIds' : args.deckId}}, {new: true})
                } 
                let hold = Deck.findByIdAndUpdate(args.deckId, {$pull : {'userIds' : args.userId}})
                return User.findByIdAndUpdate(args.userId, {$pull : {'deckIds' : args.deckId}}, {new: true})
                
            }
        },
        editHandThumb: {
            type: UserThumbType,
            args: {
                userId: {type: GraphQLString},
                handId: {type: GraphQLString},
                cardId: {type: GraphQLString},
                operation: {type: GraphQLInt }
            },
            resolve(parent,args) {
                let deleted = UserThumb.deleteMany({userId: args.userId, handId: args.handId})
                if(args.operation==-1) {
                    return deleted
                }
                deleted.exec()
                let userthumb = new UserThumb({
                    userId: args.userId,
                    handId: args.handId,
                    cardId: args.cardId,
                    dateCreated: new Date(),
                })
                return userthumb.save()
                
            }
        },
        editDeckTag: {
            type: DeckTagType,
            args: {
                id: { type: GraphQLString },
                parentTag: {type: GraphQLString},
                handIdsOrder: {type: GraphQLList(GraphQLString)},
            },
            resolve(parent,args) {
                if(args.parentTag!==undefined) {
                    return DeckTag.findByIdAndUpdate(args.id, {'parentTag' : args.parentTag}, {new: true})
                } else if(args.parentTag=='') {
                    return DeckTag.findByIdAndUpdate(args.id, {'parentTag' : undefined}, {new: true})
                }
                return DeckTag.findByIdAndUpdate(args.id, {'handIdsOrder' : args.handIdsOrder}, {new: true})
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})