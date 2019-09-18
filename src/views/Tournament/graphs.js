import gql from "graphql-tag";

const PICK_WINNER = gql`
    mutation MatchWinner($pos: Int!, $matchId: String!) {
        matchWinner(pos: $pos, matchId: $matchId) {
            id
            player1 {
                name
                publicAddress
                organization {
                    id
                    name
                }
            }
            player2 {
                name
                publicAddress
                organization {
                    id
                    name
                }
            }
            match1 {
                id
            }
            match2 {
                id
            }
            winner {
                name
                publicAddress
                organization {
                    id
                    name
                }
            }
        }
    }
`;

const ROUND_UPDATE = gql`
    mutation RoundUpdate($tournamentId: String!, $roundNumber: Int!, $standings: Object!) {
        roundUpdate(tournamentId: $tournamentId, roundNumber: $roundNumber, standings: $standings) {
            id
            tournamentId
            name
            description
            deadline
            token {
                name
                symbol
                address
                usdPrice
                tokenVersion
            }
            matches {
                id
                player1 {
                    name
                    publicAddress
                }
                player2 {
                    name
                    publicAddress
                }
                match1 {
                    id
                }
                match2 {
                    id
                }
                winner {
                    name publicAddress
                }
            }
            participants {
                id
                name
                publicAddress
                organization {
                    id
                    name
                }
                email
                avatar
            }
            owner {
                id
                name
                publicAddress
                organization {
                    id
                    name
                }
            }
            game {
                id
                url
                name
            }
            featured
            prizeDistribution
            maxPlayers
            prize
            buyInFee
            coverImage
            tournamentStatus
            tournamentFormat
            pointsToWin
            numberOfRounds
            rounds
            pointsDistribution
            bracketType
            tournamentType
            createdAt
        }
    }
`;

const ADD_PARTICIPANT = gql`
    mutation AddParticipant($tournamentId: String!, $userId: String!) {
        addParticipant(tournamentId: $tournamentId, userId: $userId) {
            id
            tournamentId
            name
            description
            deadline
            token {
                name
                symbol
                address
                usdPrice
                tokenVersion
            }
            matches {
                id
                player1 {
                    name
                    publicAddress
                }
                player2 {
                    name
                    publicAddress
                }
                match1 {
                    id
                }
                match2 {
                    id
                }
                winner {
                    name
                    publicAddress
                }
            }
            participants {
                id
                name
                publicAddress
                organization {
                    id
                    name
                }
                email
                avatar
            }
            owner {
                id
                name
                publicAddress
                organization {
                    id
                    name
                }
            }
            game {
                id
                url
                name
            }
            rounds
            roundNumber
            pointsToWin
            featured
            prizeDistribution
            maxPlayers
            prize
            buyInFee
            tournamentStatus
            tournamentFormat
            bracketType
            tournamentType
            createdAt
        }
    }
`;

const GET_TOURNAMENT = id => gql`{
    tournament(id: "${id}") {
        id
        tournamentId
        name
        description
        deadline
        token {
            name
            symbol
            address
            usdPrice
            tokenVersion
        }
        matches {
            id
            player1 {
                name
                publicAddress
            }
            player2 {
                name
                publicAddress
            }
            match1 {
                id
            }
            match2 {
                id
            }
            winner {
                name publicAddress
            }
        }
        participants {
            id
            name
            publicAddress
            organization {
                id
                name
            }
            email
            avatar
        }
        owner {
            id
            name
            publicAddress
            organization {
                id
                name
            }
        }
        game {
            id
            url
            name
        }
        firstPlace {
            id
            name
            publicAddress
            email
        }
        featured
        prizeDistribution
        maxPlayers
        prize
        buyInFee
        coverImage
        tournamentStatus
        tournamentFormat
        pointsToWin
        numberOfRounds
        rounds
        pointsDistribution
        bracketType
        tournamentType
        createdAt
    }
}`;

export {PICK_WINNER, ADD_PARTICIPANT, GET_TOURNAMENT, ROUND_UPDATE};
