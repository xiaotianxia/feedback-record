<template>
    <el-dialog
            :visible.sync="show"
            fullscreen
            center
            top="0"
            append-to-body
            title="截图">
        <div class="imgWrapper" ref="imgWrapper">
            <img :src="imgdata" ref="img" alt="截图">
        </div>
        <div slot="footer">
            <a class="el-button el-button--text" :href="imgdata" :download="`反馈截图_${new Date().getTime()}`">下载文件</a>
            <el-button @click="onCancel" size="mini">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    data () {
        return {
            show: false,
            imgdata: ''
        }
    },

    methods: {
        showDialog (data) {
            this.show = true;
            this.$nextTick(() => {
                this.$img = this.$refs.img;
                this.imgdata = data;
                this.$img.onload = () => {
                    this.ajustScroll(this.$img);
                }
            });
        },

        ajustScroll (img) {
            // 滚到水平位置
            let $imgWrapper = this.$refs.imgWrapper;
            $imgWrapper.scrollLeft = (img.width - $imgWrapper.offsetWidth) / 2;
        },

        onCancel () {
            this.show = false;
        }
    }
}
</script>

<style scoped lang="less">
    .el-dialog__wrapper {
        /deep/ .el-dialog__close {
            font-size: 40px;
        }
        /deep/ .el-dialog__footer {
            text-align: right;
            
            .el-button--mini,
            .el-button--mini.is-round {
                padding: 7px 15px;
            }
        }
    }
    .imgWrapper {
        text-align:center;
        overflow:auto;
    }
    .el-button--text {
        text-decoration: none;
        font-size: 12px;
    }
</style>

