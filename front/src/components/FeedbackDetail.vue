<template>
    <div class="fbr-detail" v-loading.fullscreen.lock="loading">
        <h3>反馈详情</h3>
        <el-form inline label-width="78px" label-position="left">
            <el-form-item label="反馈类型:">
                <span>{{detailData.type_name}}</span>
            </el-form-item>

            <el-form-item label="反馈方式:">
                <span>{{detailData.media_name}}</span>
            </el-form-item>

            <el-form-item label="解决状态">
                <el-select v-model="detailData.status" @change="onResolveChange(detailData)" placeholder="请选择" size="mini">
                    <el-option v-for="item in resolveStatusMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="提交时间:">
                <span>{{detailData.create_time}}</span>
            </el-form-item>
            
            <div></div>

            <el-form-item label="提交系统:">
                <span>{{detailData.sys_name}}</span>
            </el-form-item>

            <el-form-item label="提交者:">
                <span>{{detailData.submitter_name}}</span>
            </el-form-item>

            <el-form-item label="用户设备分辨率:" label-width="120px">
                <span v-if="detailData.device">{{detailData.device.screen && detailData.device.screen.width}} * {{detailData.device.screen && detailData.device.screen.height}}</span>
            </el-form-item>

            <div></div>

            <el-form-item label="用户代理:">
                <span v-if="detailData.device">{{detailData.device.ua}}</span>
            </el-form-item>

            <div></div>

            <el-form-item label="提交页面:">
                <span><a :href="detailData.url" target="_blank">{{detailData.url}}</a></span>
            </el-form-item>

            <div></div>

            <el-form-item label="描述:">
                <span>{{detailData.word}}</span>
            </el-form-item>

            <div></div>

            <el-form-item v-if="detailData.media === 0" label="截图:">
                <div class="img-container"><img :src="detailData.data"></div>
            </el-form-item>

            <el-form-item v-else label="录屏:">
                <div id="player-container"></div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import net from '../net';
import rrwebPlayer from 'rrweb-player';
import Enum from '../../enums';

export default {
    name: 'feedbackDetail',

    data () {
        return {
            loading: false,
            detailData: {},
            resolveStatusMap: Enum.RESOLVE_STATUS_NAME
        }
    },

    methods: {
        getDetail () {
            let param = {
                id: this.$route.query.id
            };
            this.loading = true;
            net.getDetail(param).then(res => {
                this.loading = false;
                if (res.data.status === 0) {
                    this.detailData = res.data.data;
                    this.detailData.device = JSON.parse(this.detailData.device);
                    
                    if (this.detailData.media === 1) {
                        this.renderPlayer();
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
                }
            }); 
        },

        renderPlayer () {
            try {
                new rrwebPlayer({
                    target: document.querySelector('#player-container'),
                    data: {
                        events: JSON.parse(this.detailData.data || [])
                    }
                });
            }  catch {
                this.$message.error('抱歉，回放出问题了-_-||');
            }
        }
    },

    mounted () {
        this.getDetail();
    }
}
</script>

<style scoped lang="less">
    .fbr-detail {
        margin: 40px;
        padding: 20px 20px 100px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

        .el-form {
            position: relative;
        }

        .el-form-item {
            /deep/ .el-form-item__content {
                display: inline-block;
                min-width: 150px;
                font-size: 16px;
            }
        }

        .img-container {
            width: 100%;
            overflow: hidden;
            margin: 0 auto;
            text-align: center;

            img {
                width: 100%;
                border: 1px solid #c7c7c7;
                box-sizing: border-box;
            }
        }
    }
</style>


