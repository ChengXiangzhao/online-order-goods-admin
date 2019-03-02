export default {
    name: 'ColumnRender',
    props: {
        renderCol: Function,
        record: Object,
        value: [String, Number],
        index: Number
    },

    render(h) {
        let _self = this;
        return _self.renderCol.call(
            this._renderProxy,
            h,
            {
                text: _self.value,
                record: _self.record,
                $index: _self.index
            }
        );
    }
};
