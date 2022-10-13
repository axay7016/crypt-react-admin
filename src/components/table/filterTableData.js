const _ = require('lodash');
export const filterTableData = async (trigger, filter) => {
    const columnWithValue = _.omitBy(filter, _.isEmpty)
    if (Object.keys(columnWithValue).length === 0) {
        trigger()
    } else {
        trigger(filter)
    }
}