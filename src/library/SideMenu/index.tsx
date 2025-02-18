// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SideMenuStickyThreshold } from 'consts';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { UIContextInterface } from 'contexts/UI/types';
import { ReactComponent as CogOutlineSVG } from 'img/cog-outline.svg';
import { ReactComponent as LanguageSVG } from 'img/language.svg';
import { ReactComponent as LogoGithubSVG } from 'img/logo-github.svg';
import { ReactComponent as MoonOutlineSVG } from 'img/moon-outline.svg';
import { ReactComponent as SunnyOutlineSVG } from 'img/sunny-outline.svg';
import { useOutsideAlerter } from 'library/Hooks';
import throttle from 'lodash.throttle';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultThemes } from 'theme/default';
import { capitalizeFirstLetter } from 'Utils';
import Heading from './Heading/Heading';
import { Main } from './Main';
import { Secondary } from './Secondary';
import { ConnectionSymbol, Wrapper } from './Wrapper';

export const SideMenu = () => {
  const { network, status } = useApi();
  const { mode, toggleTheme } = useTheme();
  const { openModalWith } = useModal();
  const {
    setSideMenu,
    sideMenuMinimised,
    userSideMenuMinimised,
    setUserSideMenuMinimised,
  }: UIContextInterface = useUi();
  const { t } = useTranslation('base');

  // listen to window resize to hide SideMenu
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return () => {
      window.removeEventListener('resize', windowThrottle);
    };
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SideMenuStickyThreshold) {
      setSideMenu(0);
    }
  };
  const windowThrottle = throttle(throttleCallback, 200, {
    trailing: true,
    leading: false,
  });

  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    setSideMenu(0);
  });

  // handle connection symbol
  const symbolColor =
    status === 'connecting'
      ? defaultThemes.status.warning.solid[mode]
      : status === 'connected'
      ? defaultThemes.status.success.solid[mode]
      : defaultThemes.status.danger.solid[mode];

  // handle transparent border color
  const borderColor =
    status === 'connecting'
      ? defaultThemes.status.warning.transparent[mode]
      : status === 'connected'
      ? defaultThemes.status.success.transparent[mode]
      : defaultThemes.status.danger.transparent[mode];

  return (
    <Wrapper ref={ref} minimised={sideMenuMinimised}>
      <section>
        <Main />
        <Heading title={t('network')} minimised={sideMenuMinimised} />
        <Secondary
          name={capitalizeFirstLetter(network.name)}
          borderColor={borderColor}
          // onClick={() => openModalWith('Networks')}
          onClick={() => {}}
          icon={{
            Svg: network.brand.inline.svg,
            size: network.brand.inline.size,
          }}
          minimised={sideMenuMinimised}
          action={
            <ConnectionSymbol color={[symbolColor]} style={{ opacity: 0.7 }} />
          }
        />
      </section>

      <section>
        <button
          type="button"
          onClick={() =>
            setUserSideMenuMinimised(userSideMenuMinimised ? 0 : 1)
          }
        >
          <FontAwesomeIcon
            icon={userSideMenuMinimised ? faExpandAlt : faCompressAlt}
            transform="grow-3"
          />
        </button>
        <button
          type="button"
          onClick={() =>
            window.open('https://github.com/Fair-Squares/fs-frontend', '_blank')
          }
        >
          <LogoGithubSVG width="1.4em" height="1.4em" />
        </button>
        <button
          type="button"
          onClick={() => openModalWith('Settings', {}, 'large')}
        >
          <CogOutlineSVG width="1.6em" height="1.6em" />
        </button>
        <button
          type="button"
          onClick={() => openModalWith('ChooseLanguage', {}, 'small')}
        >
          <LanguageSVG width="1.55em" height="1.55em" />
        </button>
        {mode === 'light' ? (
          <button type="button" onClick={() => toggleTheme()}>
            <SunnyOutlineSVG width="1.55em" height="1.55em" />
          </button>
        ) : (
          <button type="button" onClick={() => toggleTheme()}>
            <MoonOutlineSVG width="1.4em" height="1.4em" />
          </button>
        )}
      </section>
    </Wrapper>
  );
};

export default SideMenu;
