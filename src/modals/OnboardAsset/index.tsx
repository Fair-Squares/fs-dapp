import { faArrowUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useNotifications } from 'contexts/Notifications';
import { InputWrapper } from 'library/Form/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { unitToPlanckBn } from 'Utils';

export const OnboardAsset = () => {
  const { t } = useTranslation('pages');
  const { api } = useApi();
  const { address } = useAccount();
  const { setStatus } = useModal();
  const { decimals } = useNetworkMetrics();
  const { notifyError, notifySuccess } = useNotifications();

  const [price, setPrice] = useState(0);
  const [metadata, setMetadata] = useState<string>('');
  const [maxTenants, setMaxTenants] = useState(0);
  const [pending, setPending] = useState(false);
  const [tx, setTx] = useState<AnyApi>(null);

  const { submitTx } = useSubmitExtrinsic({
    tx,
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('sellers.onboardingSuccess'));
      setStatus(2);
    },
    callbackError: () => {
      notifyError(t('sellers.onboardingFailed'));
      setPending(false);
    },
  });

  useEffect(() => {
    if (tx) {
      setPending(true);
      submitTx();
    }
  }, [tx]);

  return (
    <>
      <Title title={t('sellers.onboardAsset')} />
      <PaddingWrapper>
        <InputWrapper>
          <div className="inner">
            <section>
              <h3>{t('sellers.price')}:</h3>
              <div className="input">
                <div>
                  <input
                    type="number"
                    placeholder={t('sellers.phAssetPrice') as string}
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </section>
          </div>
        </InputWrapper>
        <InputWrapper>
          <div className="inner">
            <section>
              <h3>{t('sellers.maxTenants')}:</h3>
              <div className="input">
                <div>
                  <input
                    type="number"
                    placeholder={t('sellers.phMaxTenants') as string}
                    value={maxTenants || ''}
                    onChange={(e) => setMaxTenants(Number(e.target.value))}
                  />
                </div>
              </div>
            </section>
          </div>
        </InputWrapper>
        <InputWrapper>
          <div className="inner">
            <section>
              <h3>{t('sellers.metadata')}:</h3>
              <div className="input">
                <div>
                  <input
                    type="text"
                    placeholder={t('sellers.phMetadata') as string}
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>
        </InputWrapper>
        <FooterWrapper>
          <ButtonSubmit
            text={t('sellers.submit')}
            disabled={pending}
            iconLeft={pending ? faSpinner : faArrowUp}
            iconTransform="grow-2"
            onClick={() => {
              setTx(
                api
                  ? api.tx.onboardingModule.createAndSubmitProposal(
                      'HOUSES',
                      unitToPlanckBn(price.toString(), decimals),
                      metadata,
                      true,
                      maxTenants
                    )
                  : null
              );
            }}
          />
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};
