<template>
    <div class="fbr-list">
        <h3>反馈列表</h3>
        <el-form :model="queryParams" inline>
            <el-form-item label="提交系统">
                <el-input v-model="queryParams.sys_name" placeholder="请选择" clearable size="mini"></el-input>
            </el-form-item>

            <el-form-item label="反馈类型">
                <el-select v-model="queryParams.type" placeholder="请选择" clearable size="mini">
                    <el-option v-for="item in typeMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="反馈方式">
                <el-select v-model="queryParams.media" placeholder="请选择" clearable size="mini">
                    <el-option v-for="item in mediaMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="状态">
                <el-select v-model="queryParams.status" placeholder="请选择" clearable size="mini" >
                    <el-option v-for="item in resolveStatusMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSearch" size="mini">查询</el-button>
            </el-form-item>

            <el-form-item>
                <a class="el-button el-button--primary is-plain el-button--mini" :href="downloadHref" target="_blank">下载列表</a>
            </el-form-item>
        </el-form>

        <el-table
            :data="list"
            v-loading="loading"
            highlight-current-row
            size="mini"
            border
            style="width: 100%">
            <el-table-column
                prop="type"
                width="90"
                label="反馈类型">
                <template slot-scope="scope">{{scope.row.type_name}}</template>
            </el-table-column>

            <el-table-column label="提交系统" fixed="left"><template slot-scope="scope">{{scope.row.sys_name}}</template></el-table-column>
            <el-table-column prop="media" label="反馈方式"><template slot-scope="scope">{{scope.row.media_name}}</template></el-table-column>

            <el-table-column
                width="200"
                prop="word"
                label="描述">
                <template slot-scope="scope">
                    <span>{{scope.row.word | cutStr(20)}}</span>
                </template>
            </el-table-column>
            
            <el-table-column label="提交人"><template slot-scope="scope">{{scope.row.submitter_name}}</template></el-table-column>

            <el-table-column label="提交时间" width="130"><template slot-scope="scope">{{scope.row.create_time}}</template></el-table-column>
            <el-table-column label="解决状态"><template slot-scope="scope">{{scope.row.status_name}}</template></el-table-column>

            <el-table-column
                width="80"
                prop="data"
                label="快速查看">
                <template slot-scope="scope">
                    <el-button @click="onPreview(scope.row)" :loading="scope.row.loading" :icon="scope.row.media === 0 ? 'el-icon-picture' : 'el-icon-video-play'" size="mini"></el-button>
                </template>
            </el-table-column>

            <el-table-column
                fixed="right"
                width="220"
                label="操作">
                <template slot-scope="scope">
                    <a :href="`#/detail?id=${scope.row.id}`" target="_blank">详情</a>
                    <el-select v-model="scope.row.status" @change="onResolveChange(scope.row)" placeholder="请选择" size="mini" style="width:100px;margin:0 12px;">
                        <el-option
                        v-for="item in resolveStatusMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button :disabled="scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 4" @click="onDelete(scope.row)" type="danger" size="mini" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="onPageSizeChange"
            @current-change="onPageChange"
            :current-page="queryParams.pageNo"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
        </el-pagination>

        <player-dialog ref="playerDialog" onlyPreview></player-dialog>
        <image-preview-dialog ref="imagePreviewDialog"> </image-preview-dialog>
    </div>
</template>

<script>
import PlayerDialog from './PlayerDialog';
import ImagePreviewDialog from './ImagePreviewDialog';
import { serialize } from '../utils/utils';
import Enum from '../../enums';
import net from '../net';
import { server_url } from '../net/config';

export default {
    name: 'feedbackList',

    data () {
        return {
            loading: false,
            queryParams: {
                sys_name: '',
                type: '',
                media: '',
                status: '',
                pageNo: 1,
                pageSize: 10
            },
            resolveStatusMap: Enum.RESOLVE_STATUS_NAME,
            typeMap: Enum.TYPE_NAME,
            mediaMap: Enum.MEDIA_NAME,
            total: 0,
            list: []
        }
    },

    computed: {
        downloadHref () {
            return `${server_url}/list/download?${serialize(this.queryParams)}`;
        }
    },

    components: {
        PlayerDialog,
        ImagePreviewDialog
    },

    methods: {
        getList () {
            let param = {
                ...this.queryParams
            };
            this.loading = true;
            net.getList(param).then(res => {
                this.loading = false;
                let data = res.data.data;
                if(res.data.status === 0) {
                    this.total = data.total;
                    this.list = data.list || [];
                }
            });
        },

        onSearch () {
            this.queryParams.pageNo = 1;
            this.getList();
        },

        onPreview (row) {
            this.$set(row, 'loading', true);
            let param = {
                id: row.id
            };
            net.view(param).then(res => {
                let data = res.data.data;
                this.$set(row, 'loading', false);
                if(res.data.status === 0) {
                    if (row.media === 0) {
                        this.$refs.imagePreviewDialog.showDialog(data.data);
                    } else {
                        this.$refs.playerDialog.showDialog(JSON.parse(data.data) || []);
                    }
                }
            });
        },

        onResolveChange (data) {
            let param = {
                id: data.id,
                status: data.status
            };
            this.loading = true;
            net.resolve(param).then(res => {
                this.loading = false;
                if(res.data.status === 0) {
                    this.$message.success('状态已变更');
                    this.getList();
                }
            }); 
        },
        
        onDelete (data) {
            this.$confirm(`确定要删除此条记录吗？`, '提示', {
                type: 'warning',
            }).then(() => {
                let param = {
                    id: data.id
                };
                this.loading = true;
                net.delete(param).then(res => {
                    this.loading = false;
                    if(res.data.status === 0) {
                        this.$message.success('删除成功');
                        this.getList();
                    }
                }); 
            }); 
        },

        onPageChange (pageNo) {
            this.queryParams.pageNo = pageNo;
            this.getList();
        },

        onPageSizeChange (pageSize) {
            this.queryParams.pageNo = 1;
            this.queryParams.pageSize = pageSize;
            this.getList();
        }
    },

    mounted () {
        this.getList();
    }
}
</script>

<style scoped lang="less">
    .fbr-list {
        width: 95%;
        padding-bottom: 100px;
        margin: 0 auto;
    }
    .el-pagination {
        float: right;
        margin-top: 10px;
    }
    .el-form {
        .el-form-item {
            margin-bottom: 0;
        }
    }
    .el-table {
        position: relative;
    }
</style>


