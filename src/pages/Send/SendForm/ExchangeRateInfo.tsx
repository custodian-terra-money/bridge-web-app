import { ReactElement, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { ArrowRepeat } from 'react-bootstrap-icons'

import { COLOR } from 'consts'

import { Text, View, Row } from 'components'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import BigNumber from 'bignumber.js'

const ExchangeRateInfo = (): ReactElement => {
  const [reversed, setReversed] = useState(false)
  const exRateUsd = useRecoilValue(SendStore.ratesUsd)

  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toAsset = useRecoilValue(SendStore.toAsset)

  // Computed data from Send data
  const amountAfterBridgeFee = useRecoilValue(SendStore.amountAfterBridgeFee)
  const exchangeRate = useRecoilValue(SendStore.exchangeRate)
  const isLoading = useRecoilValue(SendStore.isLoadingRates)
  const amount = useRecoilValue(SendStore.amount)

  const priceImpact =
    amountAfterBridgeFee.isEqualTo(0) ||
    !amount ||
    new BigNumber(amount).isEqualTo(0)
      ? new BigNumber(0)
      : new BigNumber(amount)
          .multipliedBy(exchangeRate)
          .minus(amountAfterBridgeFee)
          .div(new BigNumber(amount).multipliedBy(exchangeRate))
          .multipliedBy(100)

  return (
    <>
      {isLoggedIn && (
        <div style={{ marginBottom: 12 }}>
          <View
            style={{
              fontSize: 12,
            }}
          >
            <Row
              style={{
                justifyContent: 'flex-start',
                borderBottom: 'solid 1px #2e2e2e',
                paddingBottom: 10,
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <ArrowRepeat
                style={{
                  color: COLOR.terraSky,
                  cursor: 'pointer',
                  marginRight: '.4rem',
                  fontSize: 'small',
                  transition: 'transform .4s linear',
                  transform: `rotate(${reversed ? '180deg' : '0deg'})`,
                }}
                onClick={(): void => setReversed(!reversed)}
              />{' '}
              {reversed ? (
                <Text style={{ paddingRight: 10, color: '#737373' }}>
                  1 {toAsset?.symbol} = {(1 / exchangeRate).toFixed(6)}{' '}
                  {asset?.symbol} (${exRateUsd.to.toFixed(2)})
                </Text>
              ) : (
                <Text style={{ paddingRight: 10, color: '#CCCCCC' }}>
                  1 {asset?.symbol} = {exchangeRate.toFixed(6)}{' '}
                  {toAsset?.symbol} (${exRateUsd.from.toFixed(2)})
                </Text>
              )}
            </Row>
            <Row
              style={{
                justifyContent: 'space-between',
                borderBottom: 'solid 1px #2e2e2e',
                paddingBottom: 10,
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              <View>
                <Text style={{ paddingRight: 10, color: '#CCCCCC' }}>
                  Price Impact
                </Text>
              </View>
              <View style={{ padding: 0, alignItems: 'flex-start' }}>
                <Text
                  style={{
                    justifyContent: 'flex-end',
                    opacity: '0.8',
                    color: isLoading
                      ? '#737373'
                      : priceImpact.isGreaterThan(2.5)
                      ? COLOR.red
                      : COLOR.text,
                  }}
                >
                  {isLoading ? 'loading' : `${priceImpact.toFixed(1)} %`}
                </Text>
              </View>
            </Row>
          </View>
        </div>
      )}
    </>
  )
}

export default ExchangeRateInfo