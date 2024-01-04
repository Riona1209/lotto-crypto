import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { chainConfigs } from '../scripts/utils/configs';

import * as util from "util";
const exec = util.promisify(require('child_process').exec);

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, ethers, network } = hre;
	const { deploy } = deployments;
	const [deployer] = await ethers.getSigners();

	const deployedContract = await deploy('Lottery', {
		from: deployer.address,
		args: [
			deployer.address,
			chainConfigs[network.name]._subscriptionId,
			chainConfigs[network.name]._coordinatorId,
			chainConfigs[network.name]._keyHash,
			"Lotto Crypto",
			chainConfigs[network.name]._ticketPrice,
			chainConfigs[network.name]._minTicket,
			chainConfigs[network.name]._fee,
			chainConfigs[network.name]._configFinishTime,
			chainConfigs[network.name]._configTimeToClaim,
		],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
		skipIfAlreadyDeployed: true,
	});

	try {
		if (hre.network.name != "hardhat" && hre.network.name != "testing" && hre.network.name != "localhost") {
			const { stdout, stderr } = await exec(`npx hardhat verify --network ${hre.network.name} ${deployedContract.address} ${deployer.address} ${chainConfigs[network.name]._subscriptionId} ${chainConfigs[network.name]._coordinatorId} ${chainConfigs[network.name]._keyHash} "Lotto Crypto" ${chainConfigs[network.name]._ticketPrice} ${chainConfigs[network.name]._minTicket} ${chainConfigs[network.name]._fee} ${chainConfigs[network.name]._configFinishTime} ${chainConfigs[network.name]._configTimeToClaim}`);
			console.log('stdout:', stdout);
		}
	} catch (e) {
		console.error(e);
	}
};

export default func;
func.tags = ['Lottery'];