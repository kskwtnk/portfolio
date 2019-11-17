import React from 'react'

import { css } from '@emotion/core'

import Color from '../styles/Color'
import Size from '../styles/Size'
import Typography from '../styles/Typography'

const root = css`
  grid-column: 1 / -1;
  ${Typography.Body3};
  color: ${Color.Gray400};
  text-align: center;
  padding: ${Size(30)} 0 ${Size(10)};
  @media (max-width: 768px) {
    padding-bottom: 0;
  }
`

export default () => <footer css={root}>© 2019 Keisuke Watanuki</footer>
