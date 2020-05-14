import { Resolvers } from 'apollo-client';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Context, ContextModule } from '~context/index';
import ENS from '~lib/ENS';
import { Address, ColonyManager } from '~types/index';

import { getToken } from './token';

const getUserReputation = async (
  colonyManager: Required<Context>[ContextModule.ColonyManager],
  address: Address,
  colonyAddress: Address,
  domainId: number,
): Promise<string> => {
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(domainId);
  const { reputationAmount } = await colonyManager.networkClient.getReputation({
    address,
    colonyAddress,
    skillId,
  });
  return reputationAmount || '0';
};

export const userResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
}: Required<Context>): Resolvers => ({
  Query: {
    async userAddress(_, { name }) {
      const address = await ens.getAddress(
        ENS.getFullDomain('user', name),
        networkClient,
      );
      return address;
    },
    async userReputation(
      _,
      {
        address,
        colonyAddress,
        domainId = ROOT_DOMAIN_ID,
      }: { address: Address; colonyAddress: Address; domainId?: number },
    ) {
      const reputation = await getUserReputation(
        colonyManager,
        address,
        colonyAddress,
        domainId,
      );
      return reputation;
    },
    async username(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('user', domain);
    },
  },
  User: {
    async reputation(
      user,
      {
        colonyAddress,
        domainId = ROOT_DOMAIN_ID,
      }: { colonyAddress: Address; domainId: number },
    ) {
      const {
        profile: { walletAddress },
      } = user;
      const reputation = await getUserReputation(
        colonyManager,
        walletAddress,
        colonyAddress,
        domainId,
      );
      return reputation;
    },
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      _,
      { client },
    ) {
      return Promise.all(
        ['0x0', ...tokenAddresses].map((tokenAddress) =>
          getToken({ colonyManager, client }, tokenAddress),
        ),
      );
    },
  },
});
