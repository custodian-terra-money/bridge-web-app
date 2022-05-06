import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import { ASSET, UTIL, COLOR } from 'consts'

import { ExtLink, Text } from 'components'
import FormImage from 'components/FormImage'

import SendStore from 'store/SendStore'

import useAsset from 'hooks/useAsset'

import { BlockChainType, BridgeType } from 'types/network'
import { AssetNativeDenomEnum } from 'types/asset'
import SendProcessStore from 'store/SendProcessStore'
import useNetwork from 'hooks/useNetwork'

const StyledContainer = styled.div`
  padding-top: 20px;
`

const StyledSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  word-break: break-all;
`

const StyledSecH = styled.div`
  display: inline-block;
  color: ${COLOR.white};
  white-space: nowrap;
  opacity: 0.6;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.28px;
`

const StyledSecD = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
  padding-left: 10px;
`

const StyledSecDText = styled(Text)<{ isError?: boolean; main?: boolean }>`
  color: ${(props): string =>
    props.isError ? COLOR.red : props.main ? COLOR.terraSky : COLOR.text};
  font-size: ${(props): string => (props.main ? '17px' : '16px')};
  font-weight: ${(props): string => (props.main ? '600' : '500')};
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: -0.37px;
`

const StyledSecDText2 = styled(Text)`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.19px;
  text-align: right;
`

const StyledSpaceBetween = styled.div`
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
`

const Confirm = (): ReactElement => {
  const { formatBalance } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toAsset = useRecoilValue(SendStore.toAsset)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const amount = useRecoilValue(SendStore.amount)
  const memo = useRecoilValue(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const slippageTolerance = useRecoilValue(SendStore.slippageTolerance)

  // Computed data from Send data
  const gasFee = useRecoilValue(SendStore.gasFee)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const bridgeFee = useRecoilValue(SendStore.bridgeFee)
  const amountAfterBridgeFee = useRecoilValue(SendStore.amountAfterBridgeFee)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)

  const requestTxResult = useRecoilValue(SendProcessStore.requestTxResult)

  const { getScannerLink } = useNetwork()

  return (
    <StyledContainer>
      <StyledSection>
        <StyledSecH>Asset</StyledSecH>
        <StyledSecD>
          <FormImage
            src={asset?.logoURI || ''}
            size={18}
            style={{ paddingRight: 10 }}
          />
          <StyledSecDText>{asset?.symbol}</StyledSecDText>
          {bridgeUsed === BridgeType.thorswap && (
            <>
              <StyledSecH style={{ padding: '0 .6rem' }}>to</StyledSecH>
              <FormImage
                src={toAsset?.logoURI || ''}
                size={18}
                style={{ paddingRight: 10 }}
              />
              <StyledSecDText>{toAsset?.symbol}</StyledSecDText>
            </>
          )}
        </StyledSecD>
      </StyledSection>

      {fromBlockChain === BlockChainType.terra &&
        toBlockChain === BlockChainType.terra && (
          <StyledSection>
            <StyledSecH>Memo</StyledSecH>
            <StyledSecD>
              <Text>{memo}</Text>
            </StyledSecD>
          </StyledSection>
        )}
      <StyledSection>
        <StyledSecH>Destination Address</StyledSecH>
        <StyledSecD>
          <StyledSecDText>{UTIL.truncate(toAddress, [10, 10])}</StyledSecDText>
        </StyledSecD>
      </StyledSection>

      {fromBlockChain === BlockChainType.terra && (
        <StyledSection style={{ flexDirection: 'column', paddingBottom: 0 }}>
          <StyledSpaceBetween style={{ marginBottom: 16 }}>
            <StyledSecH>
              Gas Fee {bridgeUsed === BridgeType.thorswap && ' on Terra'}
            </StyledSecH>
            <StyledSecD>
              <StyledSecDText2>
                {`${formatBalance(gasFee)} ${ASSET.symbolOfDenom[feeDenom]}`}
              </StyledSecDText2>
            </StyledSecD>
          </StyledSpaceBetween>
        </StyledSection>
      )}

      {bridgeUsed === BridgeType.shuttle ||
      bridgeUsed === BridgeType.axelar ||
      bridgeUsed === BridgeType.wormhole ||
      bridgeUsed === BridgeType.thorswap ? (
        <>
          <StyledSection>
            {bridgeUsed === BridgeType.thorswap ? (
              <StyledSpaceBetween>
                <StyledSecH>
                  Gas Fee on{' '}
                  {toBlockChain.charAt(0).toUpperCase() + toBlockChain.slice(1)}{' '}
                  (estimated)
                </StyledSecH>
                <StyledSecD>
                  <StyledSecDText2>
                    {`${formatBalance(bridgeFee)} ${toAsset?.symbol}`}
                  </StyledSecDText2>
                </StyledSecD>
              </StyledSpaceBetween>
            ) : (
              <StyledSpaceBetween>
                <StyledSecH>
                  {bridgeUsed.charAt(0).toUpperCase() + bridgeUsed.slice(1)} fee
                  (estimated)
                </StyledSecH>
                <StyledSecD>
                  <StyledSecDText2>
                    {`${formatBalance(bridgeFee)} ${asset?.symbol}`}
                  </StyledSecDText2>
                </StyledSecD>
              </StyledSpaceBetween>
            )}
          </StyledSection>
          {bridgeUsed === BridgeType.thorswap && (
            <StyledSection>
              <StyledSpaceBetween>
                <StyledSecH>Slippage tolerance</StyledSecH>
                <StyledSecD>
                  <StyledSecDText2>{slippageTolerance} %</StyledSecDText2>
                </StyledSecD>
              </StyledSpaceBetween>
            </StyledSection>
          )}
          <StyledSection>
            {bridgeUsed === BridgeType.thorswap ? (
              <StyledSpaceBetween>
                {amountAfterBridgeFee
                  .minus(bridgeFee)
                  .isLessThanOrEqualTo(0) ? (
                  <>
                    <StyledSecH
                      style={{
                        color: COLOR.red,
                        opacity: 1,
                        fontSize: 14,
                      }}
                    >
                      Minimum received
                    </StyledSecH>
                    <StyledSecD>
                      <StyledSecDText isError={true} main>
                        {`0 ${toAsset?.symbol}`}
                      </StyledSecDText>
                    </StyledSecD>
                  </>
                ) : (
                  <>
                    <StyledSecH
                      style={{
                        color: COLOR.terraSky,
                        opacity: 1,
                        fontSize: 14,
                      }}
                    >
                      Minimum received
                    </StyledSecH>
                    <StyledSecD>
                      <StyledSecDText isError={false} main>
                        {`${formatBalance(
                          amountAfterBridgeFee
                            .multipliedBy(1 - slippageTolerance / 100)
                            .minus(bridgeFee)
                        )} ${toAsset?.symbol}`}
                      </StyledSecDText>
                    </StyledSecD>
                  </>
                )}
              </StyledSpaceBetween>
            ) : (
              <StyledSpaceBetween>
                <StyledSecH>
                  After{' '}
                  {bridgeUsed.charAt(0).toUpperCase() + bridgeUsed.slice(1)} fee
                </StyledSecH>
                <StyledSecD>
                  <StyledSecDText
                    isError={amountAfterBridgeFee.isLessThanOrEqualTo(0)}
                  >
                    {`${formatBalance(amountAfterBridgeFee)} ${asset?.symbol}`}
                  </StyledSecDText>
                </StyledSecD>
              </StyledSpaceBetween>
            )}
          </StyledSection>
        </>
      ) : (
        <StyledSection>
          <StyledSpaceBetween>
            <StyledSecH>Receive amount</StyledSecH>
            <StyledSecD>
              <StyledSecDText>{`${formatBalance(amount)} ${
                asset?.symbol
              }`}</StyledSecDText>
            </StyledSecD>
          </StyledSpaceBetween>
        </StyledSection>
      )}

      {requestTxResult?.success && (
        <StyledSection>
          <StyledSecH style={{ color: '#5592f7', opacity: 1 }}>TX</StyledSecH>
          <StyledSecD>
            <StyledSecDText2>
              {
                <ExtLink
                  href={getScannerLink({
                    address: requestTxResult.hash,
                    type: 'tx',
                  })}
                  style={{ padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <div>{UTIL.truncate(requestTxResult.hash, [15, 15])}</div>
                  <BoxArrowUpRight
                    color="#5592f7"
                    style={{ paddingLeft: 3, marginTop: -2 }}
                  />
                </ExtLink>
              }
            </StyledSecDText2>
          </StyledSecD>
        </StyledSection>
      )}
    </StyledContainer>
  )
}

export default Confirm
