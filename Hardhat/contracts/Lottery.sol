// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./VRFV2Consumer.sol";

contract Lottery is
    ReentrancyGuard,
    VRFV2Consumer,
    AutomationCompatibleInterface
{

    struct Ticket {
        uint256 ticketId;
        uint256 timestamp;
    }

    struct User {
        bool hasTicket;
        bool claimed;
        Ticket[] tickets;
    }

    struct LotteryStruct {
        string name;
        uint256 ticketPrice;
        uint256 ticketsCount;
        uint256 startedTime;
        uint256 balance;
        bool finalized;
        uint256 indexChainLink;
        address winner;
        bool claimed;
        uint32 minTicket;
        bool finishTrigger;
        uint256 timeToFinish;
        uint256 timeToClaim;
    }

    mapping(uint256 => mapping(address => User)) ticketOwners;
    mapping(uint256 => mapping(uint256 => address)) tickets;
    mapping(uint256 => LotteryStruct) lottery;

    uint256 public lotteryId;
    uint256 public fee;
    uint256 public configFinishTime;
    uint256 public configTimeToClaim;
    uint32 public minTicket;
    uint256 public ticketPrice;
    string public lotteryName;

    event TicketBought(
        address indexed buyer,
        uint256 price,
        uint256 ticketNumber
    );
    event MinTicketsReached(
        uint256 ticketNumber,
        uint32 minTickets,
        uint256 balance,
        uint256 finishTime
    );
    event LotteryFinalized(
        address owner,
        uint256 totalValue,
        uint256 ticketAmount
    );
    event ClaimedPrize(
        address indexed winner,
        uint256 lotteryIndex,
        uint256 totalPrize,
        uint256 fee
    );
    event ClaimedExpiredPrize(
        address indexed winner,
        address owner,
        uint256 lotteryIndex,
        uint256 totalPrize
    );
    event ChangedProperties(
        address indexed owner,
        string name,
        uint256 ticketPrize,
        uint256 fee,
        uint32 minTicket,
        uint256 configFinishTime,
        uint256 configTimeToClaim
    );

    constructor(
        address owner,
        uint64 _subscriptionId,
        address _cordinatorAddress,
        bytes32 _keyHash,
        string memory _name,
        uint256 _ticketPrice,
        uint32 _minTicket,
        uint256 _fee,
        uint256 _configFinishTime,
        uint256 _configTimeToClaim
    ) VRFV2Consumer(owner, _subscriptionId, _cordinatorAddress, _keyHash) {
        // Start with LotteryId=1
        lotteryId++;
        uint256 currentLottery = lotteryId;

        lottery[currentLottery].name = _name;
        lottery[currentLottery].ticketPrice = _ticketPrice;
        lottery[currentLottery].minTicket = _minTicket;
        lottery[currentLottery].startedTime = block.timestamp;

        fee = _fee;
        lotteryName = _name;
        configFinishTime = _configFinishTime;
        configTimeToClaim = _configTimeToClaim;
        ticketPrice = _ticketPrice;
        minTicket = _minTicket;
    }

    function buyTicket() external payable nonReentrant {
        uint256 currentLottery = lotteryId;
        require(
            !lottery[currentLottery].finalized,
            "This lottery has already finalized, wait for results!"
        );
        require(
            lottery[currentLottery].ticketPrice == msg.value,
            "You need to pay the exactly ticket price."
        );

        uint256 currentLotteryPosition = lottery[currentLottery]
            .ticketsCount;
        lottery[currentLottery].ticketsCount ++;

        ticketOwners[currentLottery][msg.sender].hasTicket = true;
        ticketOwners[currentLottery][msg.sender].claimed = false;
        ticketOwners[currentLottery][msg.sender].tickets.push(
            Ticket(currentLotteryPosition, block.timestamp)
        );

        tickets[currentLottery][currentLotteryPosition] = msg.sender;
        lottery[currentLottery].balance += msg.value;

        uint256 nextLotteryPosition = lottery[currentLottery]
            .ticketsCount;

        if (
            !lottery[currentLottery].finishTrigger &&
            nextLotteryPosition >= lottery[currentLottery].minTicket
        ) {
            lottery[currentLottery].finishTrigger = true;
            lottery[currentLottery].timeToFinish =
                block.timestamp +
                configFinishTime;

            emit MinTicketsReached(
                nextLotteryPosition,
                lottery[currentLottery].minTicket,
                lottery[currentLottery].balance,
                lottery[currentLottery].timeToFinish
            );
        }

        emit TicketBought(msg.sender, msg.value, currentLottery);
    }

    function finalizeLottery() private {
        uint256 currentLottery = lotteryId;
        uint256 currentLotteryPosition = lottery[currentLottery]
            .ticketsCount;

        require(
            lottery[currentLottery].minTicket <= currentLotteryPosition,
            "It Didnt reach min tickets yet."
        );

        require(
            !lottery[currentLottery].finalized,
            "Lottery already finalized."
        );

        lottery[currentLottery].finalized = true;
        lottery[currentLottery].indexChainLink = requestRandomWords(1);
        emit LotteryFinalized(
            msg.sender,
            lottery[currentLottery].balance,
            lottery[currentLottery].ticketsCount
        );
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        super.fulfillRandomWords(_requestId, _randomWords);
        uint256 currentLottery = lotteryId;
        uint256 currentLotteryPosition = lottery[currentLottery]
            .ticketsCount;
        if (_requestId == lottery[currentLottery].indexChainLink) {
            lottery[currentLottery].winner = tickets[currentLottery][
                _randomWords[0] % currentLotteryPosition
            ];
            lottery[currentLottery].timeToClaim =
                block.timestamp +
                configTimeToClaim;
            require(resetLottery(), "Lottery needs to be reseted");
        }
    }

    function claim(uint256 lotteryIndex) external nonReentrant {
        require(
            !lottery[lotteryIndex].claimed,
            "The winner already claimed its prize."
        );
        require(
            lottery[lotteryIndex].finalized,
            "This lottery isn't finalized yet."
        );
        require(
            lottery[lotteryIndex].winner != address(0),
            "This lottery didn't get a winner yet."
        );
        require(
            ticketOwners[lotteryIndex][msg.sender].hasTicket,
            "You dont have any ticket to claim here."
        );
        require(
            lottery[lotteryIndex].winner == msg.sender,
            "You're not the winner."
        );
        require(
            !ticketOwners[lotteryIndex][msg.sender].claimed,
            "You have alread claimed your prize."
        );
        lottery[lotteryIndex].claimed = true;
        ticketOwners[lotteryIndex][msg.sender].hasTicket = false;
        ticketOwners[lotteryIndex][msg.sender].claimed = true;

        uint256 _feeAmount = _calcFee(lottery[lotteryIndex].balance);
        uint256 prize = lottery[lotteryIndex].balance - _feeAmount;

        payable(owner()).transfer(_feeAmount);
        payable(msg.sender).transfer(prize);
        emit ClaimedPrize(msg.sender, lotteryIndex, prize, _feeAmount);
    }

    function claimExpiredLottery(uint256 lotteryIndex) external onlyOwner {
        require(
            !lottery[lotteryIndex].claimed,
            "The winner already claimed its prize."
        );
        require(
            lottery[lotteryIndex].finalized,
            "This lottery isn't finalized yet."
        );
        require(
            lottery[lotteryIndex].winner != address(0),
            "This lottery didn't get a winner yet."
        );
        require(
            lottery[lotteryIndex].timeToClaim < block.timestamp,
            "You can't claim before timeToClaim get expired."
        );

        lottery[lotteryIndex].claimed = true;

        payable(owner()).transfer(lottery[lotteryIndex].balance);
        emit ClaimedExpiredPrize(lottery[lotteryIndex].winner, msg.sender, lotteryIndex, lottery[lotteryIndex].balance);
    }

    function resetLottery() private returns (bool) {
        lotteryId++;

        lottery[lotteryId].name = lotteryName;
        lottery[lotteryId].ticketPrice = ticketPrice;
        lottery[lotteryId].minTicket = minTicket;
        lottery[lotteryId].startedTime = block.timestamp;

        return true;
    }

    function _calcFee(uint256 amount) private view returns (uint256) {
        return (amount * fee) / 100;
    }

    function setProperties(
        string memory _name,
        uint256 _ticketPrice,
        uint32 _minTicket,
        uint256 _configFinishTime,
        uint256 _configTimeToClaim,
        uint256 _fee
    ) external onlyOwner {
        require(_fee <= 30, "Fee can't be better than 30%");

        fee = _fee;
        configFinishTime = _configFinishTime;
        configTimeToClaim = _configTimeToClaim;
        ticketPrice = _ticketPrice;
        minTicket = _minTicket;
        emit ChangedProperties(
            msg.sender,
            _name,
            _ticketPrice,
            _fee,
            _minTicket,
            _configFinishTime,
            _configTimeToClaim
        );
    }

    function getLotteryStatus(
        uint256 _lotteryId
    ) public view returns (LotteryStruct memory _lottery) {
        return lottery[_lotteryId];
    }

    function getUserStatus(
        uint256 _lotteryId,
        address _user
    ) public view returns (User memory _returnedUser) {
        return ticketOwners[_lotteryId][_user];
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        uint256 currentLottery = lotteryId;
        upkeepNeeded = (lottery[currentLottery].finishTrigger &&
            block.timestamp > lottery[currentLottery].timeToFinish);
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        uint256 currentLottery = lotteryId;

        require(
            (lottery[currentLottery].finishTrigger &&
                block.timestamp > lottery[currentLottery].timeToFinish),
            "Not read yet"
        );
        finalizeLottery();
    }
}
