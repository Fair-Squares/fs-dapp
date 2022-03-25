// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout/Wrappers';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import Payouts from './Payouts';
import BalanceGraph from './BalanceGraph';
import Announcements from './Announcements';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useSubscan } from '../../contexts/Subscan';
import { SubscanButton } from '../../library/SubscanButton';
import { PageTitle } from '../../library/PageTitle';

export const Overview = (props: PageProps) => {

  const { network }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { staking }: any = useStakingMetrics();
  const { payouts }: any = useSubscan();

  // stats
  const items = [
    {
      label: "Total Nominators",
      value: staking.totalNominators,
      unit: "",
      format: "number",
    },
    {
      label: "Total Staked",
      value: staking.lastTotalStake,
      unit: network.unit,
      format: "number",
    },
    {
      label: "Last Reward Payout",
      value: staking.lastReward,
      unit: network.unit,
      format: "number",
    },
  ];

  const GRAPH_HEIGHT = 430;

  return (
    <>
      <PageTitle title="What's Happening" />
        <StatBoxList items={items} />
      <PageRowWrapper noVerticalSpacer>
        <SecondaryWrapper>
          <GraphWrapper
            style={{ minHeight: GRAPH_HEIGHT }}
            flex
          >
            <BalanceGraph network={network} />
          </GraphWrapper>
        </SecondaryWrapper>
        <MainWrapper paddingLeft>
          <GraphWrapper
            style={{ minHeight: GRAPH_HEIGHT }}
            flex
          >
            <SubscanButton />
            <h3>Recent Payouts</h3>
            <Payouts account={activeAccount} payouts={payouts.slice(50, 60)} />
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <Announcements />
      </PageRowWrapper>
    </>
  );
}

export default Overview;