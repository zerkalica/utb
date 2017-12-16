// @flow

import {inject, observer} from 'stubs/mobx'

import TodoFooterView from '../../../common/TodoFooterView'

export default inject(stores => stores.todoService)(observer(TodoFooterView))
