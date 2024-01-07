export class Confg {
    _subscriptionId: string = "";
    _coordinatorId: string = "";
    _keyHash: string = "";
    _ticketPrice: string = "";
    _minTicket: string = "";
    _fee: string = "";
    _configFinishTime: string = "";
    _configTimeToClaim: string = "";
}

export interface IIndexable {
    [key: string]: Confg;
}

export const chainConfigs: IIndexable = {
    polygonMumbai: {
        _subscriptionId: "3262",
        _coordinatorId: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
        _keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        _ticketPrice: "10000000000000000", // 0,001 ETHER
        _minTicket: "5",
        _fee: "10", // 10%
        _configFinishTime: "300",
        _configTimeToClaim: "1800",
    },
    polygon: {
        _subscriptionId: "671",
        _coordinatorId: "0xae975071be8f8ee67addbc1a82488f1c24858067",
        _keyHash: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93",
        _ticketPrice: "1000000000000000000", // 1 ETHER
        _minTicket: "10",
        _fee: "10", // 10%
        _configFinishTime: "86400",
        _configTimeToClaim: "86400",
    },
    hardhat: {
        _subscriptionId: "3262",
        _coordinatorId: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
        _keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        _ticketPrice: "10000000000000000", // 0,001 ETHER
        _minTicket: "5",
        _fee: "10", // 10%
        _configFinishTime: "60",
        _configTimeToClaim: "60",
    },
    localhost: {
        _subscriptionId: "3262",
        _coordinatorId: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
        _keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        _ticketPrice: "10000000000000000", // 0,001 ETHER
        _minTicket: "5",
        _fee: "10", // 10%
        _configFinishTime: "60",
        _configTimeToClaim: "60",
    }
}