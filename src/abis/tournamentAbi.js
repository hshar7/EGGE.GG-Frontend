export default [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "name": "_deadline",
                "type": "uint256"
            }
        ],
        "name": "changeDeadline",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tournamentId",
                "type": "uint256"
            }
        ],
        "name": "getTournament",
        "outputs": [
            {
                "components": [
                    {
                        "name": "organizer",
                        "type": "address"
                    },
                    {
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "name": "active",
                        "type": "bool"
                    },
                    {
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "name": "tokenVersion",
                        "type": "uint256"
                    },
                    {
                        "name": "balance",
                        "type": "uint256"
                    },
                    {
                        "name": "hasPaidOut",
                        "type": "bool"
                    },
                    {
                        "name": "prizeDistribution",
                        "type": "uint256[]"
                    }
                ],
                "name": "",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_organizer",
                "type": "address"
            },
            {
                "name": "_data",
                "type": "string"
            },
            {
                "name": "_deadline",
                "type": "uint256"
            },
            {
                "name": "_token",
                "type": "address"
            },
            {
                "name": "_tokenVersion",
                "type": "uint256"
            },
            {
                "name": "_maxPlayers",
                "type": "uint256"
            },
            {
                "name": "_prizeDistribution",
                "type": "uint256[]"
            }
        ],
        "name": "newTournament",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "callStarted",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tournaments",
        "outputs": [
            {
                "name": "organizer",
                "type": "address"
            },
            {
                "name": "deadline",
                "type": "uint256"
            },
            {
                "name": "active",
                "type": "bool"
            },
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "tokenVersion",
                "type": "uint256"
            },
            {
                "name": "balance",
                "type": "uint256"
            },
            {
                "name": "hasPaidOut",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "numTournaments",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "contribute",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "name": "_winners",
                "type": "address[]"
            }
        ],
        "name": "payoutWinners",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tokenBalances",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_organizer",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_data",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_deadline",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_tokenVersion",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_maxPlayers",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_prizeDistribution",
                "type": "uint256[]"
            }
        ],
        "name": "TournamentIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_contributor",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "ContributionAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_changer",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_deadline",
                "type": "uint256"
            }
        ],
        "name": "TournamentDeadlineChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_tournamentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_winners",
                "type": "address[]"
            }
        ],
        "name": "TournamentFinalized",
        "type": "event"
    }
];
