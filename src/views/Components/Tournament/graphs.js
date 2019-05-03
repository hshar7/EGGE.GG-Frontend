import gql from "graphql-tag";

const PICK_WINNER = gql`
  mutation MatchWinner($pos: Int!, $matchId: String!) {
    matchWinner(pos: $pos, matchId: $matchId) {
      id
      player1 {
        name
        publicAddress
        organization
      }
      player2 {
        name
        publicAddress
        organization
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
        organization
      }
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
          organization
        }
        player2 {
          name
          publicAddress
          organization
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
          organization
        }
      }
      participants {
        id
        name
        publicAddress
        organization
        email
      }
      owner {
        id
        name
        publicAddress
        organization
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
      status
      createdAt
    }
  }
`;

const GET_TOURNAMENT = id => gql`
    {
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
            organization
          }
          player2 {
            name
            publicAddress
            organization
          }
          match1 {
            id
          }
          match2 {
            id
          }
          winner {
            name publicAddress
            organization
          }
        }
        participants {
          id
          name
          publicAddress
          organization
          email
        }
        owner {
          id
          name
          publicAddress
          organization
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
        status
        createdAt
      }
    }
  `;

export { PICK_WINNER, ADD_PARTICIPANT, GET_TOURNAMENT };
