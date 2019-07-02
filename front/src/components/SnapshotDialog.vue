<template>
    <el-dialog
            :visible.sync="show"
            width="80%"
            center
            top="0"
            append-to-body
            @close="onClose"
            title="截图">
        <common-form ref="formComp" @change="onFormChange"></common-form>
        <div id="toolbar-container"></div>
        <div class="fbrSnapshotWrapper" ref="fbrSnapshotWrapper"></div>
        <div slot="footer">
            <el-button type="primary" @click="onConfirm" :loading="loading" size="mini">提交</el-button>
            <el-button @click="onCancel" size="mini">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import CanvasToolkit from '../utils/canvasToolkit/';
import CommonForm from './CommonForm';
import { trim, get } from 'lodash-es';
import net from '../net';
import Vue from 'vue';

export default {
    data () {
        return {
            show: false,
            loading: false,
            canvasTool: null,
            type: 0,
            word: ''
        }
    },

    props: {
        submitter: {
            type: Object,
            default: () => {}
        },

        // 系统名称
        sysName: {
			type: String,
			default: ''
		}
    },

    components: {
        CommonForm
    },

    methods: {
        showDialog (canvas) {
            this.show = true;
            this.canvas = canvas;
            this.$nextTick(() => {
                this.restForm();
                this.$fbrSnapshotWrapper = this.$refs.fbrSnapshotWrapper;
                this.$fbrSnapshotWrapper.innerHTML = '';
                this.$fbrSnapshotWrapper.appendChild(canvas);
                
                this.ajustScroll(canvas);
                
                this.canvasTool = new CanvasToolkit(canvas, {
                    toolBar: document.getElementById('toolbar-container')
                });
            });
        },

        ajustScroll (canvas) {
            // 滚到水平位置
            this.$fbrSnapshotWrapper.scrollLeft = (canvas.width - this.$fbrSnapshotWrapper.offsetWidth) / 2;
        },

        onFormChange (e) {
            this.type = e.type || 0;
            this.word = e.word;
        },

        onConfirm () {
            let image = new Image();
            image.setAttribute("crossOrigin",'Anonymous');
            image.src = this.canvas.toDataURL('image/jpeg', 0.3);
            let param = {
                type: this.type,
                media: 0,
                data: image.src,
                word: trim(this.word),
                submitter_id: get(this.submitter, 'id') || 0,
                submitter_name: get(this.submitter, 'name') || '',
                sys_name: this.sysName,
                url: window.location.href,
                device: JSON.stringify({
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height
                    },
                    ua: navigator.userAgent
                })
            };
            this.loading = true;
            Vue.toasted && Vue.toasted.show('数据量较大，请耐心等待一会~');
            net.add(param).then(res => {
                this.loading = false;
                if(res.data.status === 0) {
                    this.show = false;
                    this.$message.success('提交成功');
                }
            });
        },

        onCancel () {
            this.show = false;
        },

        onClose () {
            this.canvasTool.hideInput();
        },

        restForm () {
            this.loading = false;
            this.$refs.formComp.resetForm();
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
    .fbrSnapshotWrapper {
        position: relative;
        overflow: auto;
        text-align: center;
        border: 1px solid rgba(0, 0, 0, .2);
        
        /deep/ .mirrorCanavs {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99;
            &.pencil {
                cursor: url('../assets/pencil.png') 0 17, crosshair;
            }
            &.brush {
                cursor: url('../assets/brush.png') 0 9, crosshair;
            }
            &.crosshair {
                cursor: crosshair;
            }
            &.text {
                cursor: text;
            }
        }
    }
    .form {
        margin-bottom: 10px;
    }
    #toolbar-container {
        text-align: right;
        padding-right: 10px;
    }
</style>

