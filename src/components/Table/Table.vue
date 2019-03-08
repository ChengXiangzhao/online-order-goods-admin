<template>
  <div :class="['component-table', 'standardTable']">
      <div :class="[{'table_border': border}]">
          <el-table
              ref="commonTable"
              v-loading="loading"
              :data="dataSource"
              :key="tableKey?tableKey:randomNum"
              header-row-class-name="table_head"
              :row-class-name='rowClassName'
              :cell-class-name='cellClassName'
              :cell-style="{padding: '0px'}"
              :stripe="stripe"
              style="width: 100%; height: 100%;"
              @row-click="rowClick"
              @row-dblclick="rowdblClick"
              @selection-change="selectionChange"
              @select="rowSelect"
              @select-all="selectAll"
              :show-header='showHeader'
              @expand-change="config.expandChange"
              v-bind="config"
              @sort-change="sortChange">
              <template v-for="item in columns">
                  <el-table-column :key="item.dataIndex" v-if="item.render" v-bind="item">
                      <template slot-scope="{row, column, $index}">
                          <column-render
                              :renderCol="item.render"
                              :record="row"
                              :value="row[item.dataIndex]"
                              :index="$index"
                          ></column-render>
                      </template>
                  </el-table-column>
                  <el-table-column :key="item.prop" v-bind="item" v-else></el-table-column>
              </template>
          </el-table>
      </div>
    <el-pagination
        v-if="hasPagination"
        background
        small
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        :pager-count="pagerCount"
        :layout="layout ? layout : `total, sizes, prev, pager, next, jumper`"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>

import ColumnRender from './column-render';
import random from 'lodash/random';
export default {
    name: 'table',
    data() {
        return {
            randomNum: random(1, 1000000000000)
        };
    },
    props: {
        config: {
            type: Object,
            default: {}
        },
        dataSource: {
            type: Array
        },
        columns: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        layout: {
            type: String
        },
        height: {
            type: [Number, Boolean]
        },
        render: {
            type: Function
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean
        },
        currentPage: {
            type: Number
        },
        pageSize: {
            type: Number
        },
        pagerCount: {
            type: Number
        },
        total: {
            type: Number
        },
        hasPagination: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        cellClassName: {
            type: Function
        },
        rowClassName: {
            type: Function,
            default() {
                return 'row';
            }
        },
        tableKey: {
            type: Number
        }
    },
    components: {
        ColumnRender
    },
    methods: {
        handleCurrentChange(val) {
            this.$emit('handleCurrent', val);
        },
        handleSizeChange(val) {
            this.$emit('handleSize', val);
        },
        rowClick(row, event, column) {
            this.$emit('rowClick', row, event, column);
        },
        rowdblClick(row, event) {
            this.$emit('rowdblClick', row, event);
        },
        selectionChange (selection) {
            this.$emit('selectionChange', selection);
        },
        toggleRowSelection (row, selected) {
            this.$refs.commonTable.toggleRowSelection(row, selected);
        },
        clearSelection () {
            this.$refs.commonTable.clearSelection();
        },
        sortChange(data) {
            this.$emit('sortChange', data);
        },
        rowSelect(selection, row) {
            this.$emit('rowSelect', selection, row);
        },
        selectAll(selection) {
            this.$emit('selectAll', selection);
        },
        clearSort () {
            this.$refs.commonTable.clearSort();
        }
    }
};
</script>

<style lang="scss">
.component-table.standardTable {
    width: 100%;
    .row {
        height: 32px;
    }
}
</style>
