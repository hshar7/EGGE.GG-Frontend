import gql from "graphql-tag";

const PICK_WINNER = gql`
    mutation MatchWinner($pos: Int!, $matchId: String!) {
        matchWinner(pos: $pos, matchId: $matchId) {
            id
            team1 {
                id
                name
                members {
                    id
                    publicAddress
                    username
                }
            }
            team2 {
                id
                name
                members {
                    id
                    publicAddress
                    username
                }
            }
            match1 {
                id
            }
            match2 {
                id
            }
            winner {
                id
                name
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
            participants {
                id
                name
                publicAddress
                email
                avatar
            }
            owner {
                id
                name
                publicAddress
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

const START_TOURNAMENT = gql`
    mutation StartTournament($tournamentId: String!) {
        startTournament(tournamentId: $tournamentId) {
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
                team1 {
                    id
                    name
                    members {
                        id
                        publicAddress
                        username
                    }
                }
                team2 {
                    id
                    name
                    members {
                        id
                        publicAddress
                        username
                    }
                }
                match1 {
                    id
                }
                match2 {
                    id
                }
                winner {
                    id
                    name
                }
            }
            participants {
                id
                name
                owner {
                    id
                    name
                    publicAddress
                }
            }
            owner {
                id
                name
                publicAddress
            }
            game {
                id
                url
                name
            }
            featured
            prizeDistribution
            maxTeams
            teamSize
            prize
            buyInFee
            coverImage
            tournamentStatus
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
    mutation AddParticipant($tournamentId: String!, $teamId: String!) {
        addParticipant(tournamentId: $tournamentId, teamId: $teamId) {
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
                team1 {
                    id
                    name
                    members {
                        id
                        publicAddress
                        username
                    }
                }
                team2 {
                    id
                    name
                    members {
                        id
                        publicAddress
                        username
                    }
                }
                match1 {
                    id
                }
                match2 {
                    id
                }
                winner {
                    id
                    name
                }
            }
            participants {
                id
                name
                owner {
                    id
                    name
                    publicAddress
                }
            }
            owner {
                id
                name
                publicAddress
            }
            game {
                id
                url
                name
            }
            rounds
            numberOfRounds
            pointsToWin
            featured
            prizeDistribution
            maxTeams
            teamSize
            prize
            buyInFee
            tournamentStatus
            bracketType
            tournamentType
            createdAt
        }
    }
`;

const REMOVE_PARTICIPANT = gql`
    mutation RemoveParticipant($tournamentId: String!, $teamId: String!) {
        removeParticipant(tournamentId: $tournamentId, teamId: $teamId) {
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
                team1 {
                    id
                    name
                    members {
                        id
                        publicAddress
                        username
                    }
                }
                team2 {
                    id
                    name
                    members {
                        id
                        publicAddress
                        username
                    }
                }
                match1 {
                    id
                }
                match2 {
                    id
                }
                winner {
                    id
                    name
                }
            }
            participants {
                id
                name
                owner {
                    id
                    name
                    publicAddress
                }
            }
            owner {
                id
                name
                publicAddress
            }
            game {
                id
                url
                name
            }
            rounds
            numberOfRounds
            pointsToWin
            featured
            prizeDistribution
            maxTeams
            teamSize
            prize
            buyInFee
            tournamentStatus
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
            team1 {
                id
                name
                members {
                    id
                    publicAddress
                    username
                }
            }
            team2 {
                id
                name
                members {
                    id
                    publicAddress
                    username
                }
            }
            match1 {
                id
            }
            match2 {
                id
            }
            winner {
                id
                name
            }
        }
        participants {
            id
            name
            owner {
                id
                name
                publicAddress
            }
        }
        owner {
            id
            name
            publicAddress
        }
        game {
            id
            url
            name
        }
        featured
        prizeDistribution
        prize
        buyInFee
        coverImage
        tournamentStatus
        maxTeams
        teamSize
        pointsToWin
        numberOfRounds
        rounds
        pointsDistribution
        bracketType
        tournamentType
        createdAt
    }
}`;

export {PICK_WINNER, ADD_PARTICIPANT, REMOVE_PARTICIPANT, GET_TOURNAMENT, ROUND_UPDATE, START_TOURNAMENT};
