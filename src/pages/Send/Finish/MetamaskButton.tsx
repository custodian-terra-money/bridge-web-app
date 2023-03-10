import { ReactElement } from 'react'
import styled from 'styled-components'
import { COLOR } from 'consts'
import MetamaskImg from '../../../images/metamask.svg'
import { BlockChainType } from 'types'

const StyledButton = styled.button`
  border: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0000;
  color: ${COLOR.white};
  cursor: pointer;
  margin-bottom: 1.3rem;
  margin-top: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.6rem;

  &:hover {
    background-color: ${COLOR.darkGray};
  }
`

const StyledIcon = styled.img`
  width: 20px;
  margin-right: 0.6rem;
`

interface MetamaskTokenProps {
  name: string
  chain: BlockChainType
  imgUrl: string
  token: string
  decimals: number
}

export default function MetamaskButton({
  name,
  chain,
  imgUrl,
  token,
  decimals,
}: MetamaskTokenProps): ReactElement {
  const fixedName = name.startsWith('axl') ? name.slice(3) : name

  return (
    <StyledButton
      onClick={(): void => {
        window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token,
              symbol: fixedName,
              decimals,
              image: imgUrl,
            },
          },
        })
      }}
    >
      <StyledIcon src={MetamaskImg} alt="Metamask logo" />
      Add {chain === BlockChainType.ethereum ? fixedName : name} to Metamask
    </StyledButton>
  )
}
