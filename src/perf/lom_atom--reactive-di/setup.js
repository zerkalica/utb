// @flow

import {createCreateElement} from 'reactive-di'
import {h} from 'react-stubs'
import atomize from './atomize'

const lomCreateElement = createCreateElement(
    atomize,
    h
)
global['lom_h'] = lomCreateElement
