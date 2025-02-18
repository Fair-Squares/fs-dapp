// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useApi } from 'contexts/Api';
import React, { useEffect, useState } from 'react';
import { AnyApi, AnyJson } from 'types';
import { parseHumanBN } from 'Utils';
import { defaultAssetsContext } from './defaults';
import { Asset, AssetsContextInterface } from './types';

export const AssetsContext =
  React.createContext<AssetsContextInterface>(defaultAssetsContext);

type NftItem = {
  collId: number;
  itemId: number;
};

export const useAssets = () => React.useContext(AssetsContext);

export const AssetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady, api } = useApi();
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [collectionSize, setCollectionSize] = useState<Array<number>>([]);
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  const subscribeToNfts = async () => {
    if (!isReady || !api) return;

    const _unsub = api.query.nftModule.itemsCount((itemsCount: AnyApi) => {
      setCollectionSize(itemsCount.toHuman());
    });

    setUnsub(_unsub);
  };

  const fetchAssets = async () => {
    if (!api) return;
    const len = collectionSize.length;
    const nftItems: NftItem[] = [];
    for (let collId = 0; collId < len; ++collId) {
      for (let itemId = 0; itemId < collectionSize[collId]; ++itemId)
        nftItems.push({ collId, itemId });
    }
    const res = await api.query.onboardingModule.houses.multi(
      nftItems.map(({ collId, itemId }) => [collId, itemId])
    );
    const _assets = res
      .map((item) => item.toHuman())
      .map((nft: any, index) => ({
        collId: nftItems[index].collId,
        itemId: nftItems[index].itemId,
        status: nft?.status,
        created: nft?.created,
        metadata: nft?.infos.metadata,
        price: parseHumanBN(nft?.price),
        tenants: nft?.tenants,
        proposalHash: nft?.proposalHash,
        representative: nft?.representative,
      }));
    setAssets(_assets);
  };

  const fetchAssetAccount = async (_collId: number, _itemId: number) => {
    if (!api) return null;
    const res = await api.query.uniques.asset(_collId, _itemId);
    if (res.isEmpty) return null;
    const data: AnyJson = res.toPrimitive();
    return data.owner;
  };

  useEffect(() => {
    fetchAssets();
  }, [collectionSize]);

  useEffect(() => {
    subscribeToNfts();
    return () => {
      if (unsub) unsub.then();
    };
  }, [isReady]);

  return (
    <AssetsContext.Provider
      value={{
        assets,
        fetchAssets,
        fetchAssetAccount,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
