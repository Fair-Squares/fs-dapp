// Copyright 2023 Fair Squares
// SPDX-License-Identifier: Apache-2.0

import { FairSquaresUrl } from 'consts';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { UIContextInterface } from 'contexts/UI/types';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Primary } from './Primary';
import { LogoWrapper } from './Wrapper';

export const Main = () => {
  const { network } = useApi();
  const { pathname } = useLocation();
  const { role } = useAccount();
  const { sideMenuMinimised }: UIContextInterface = useUi();

  return (
    <>
      <LogoWrapper
        onClick={() => {
          window.open(FairSquaresUrl, '_blank');
        }}
        minimised={sideMenuMinimised}
      >
        {sideMenuMinimised ? (
          <network.brand.icon style={{ maxHeight: '100%', width: '2rem' }} />
        ) : (
          <>
            <network.brand.logo.svg
              style={{
                maxHeight: '100%',
                height: '100%',
                width: network.brand.logo.width,
              }}
            />
          </>
        )}
      </LogoWrapper>

      <React.Fragment key="sidemenu_category_default">
        {/* display heading if not `default` (used for top links) */}
        {/* <Heading title={t(categoryKey)} minimised={sideMenuMinimised} /> */}
        {/* display category links */}

        <React.Fragment key="sidemenu_page_dashboard">
          <Primary
            name="Dashboard"
            to="/dashboard"
            active={pathname === '/dashboard'}
            minimised={sideMenuMinimised}
          />
        </React.Fragment>
        {role === 'INVESTOR' && (
          <React.Fragment key="sidemenu_page_investors">
            <Primary
              name="Investors"
              to="/investors"
              active={pathname === '/investors'}
              minimised={sideMenuMinimised}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    </>
  );
};
