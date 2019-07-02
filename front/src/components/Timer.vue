<template>
    <div class="timer-wrapper">
        <span class="light" :class="{flash: starting}"></span>
        <span class="time">{{time}}</span>
    </div>
</template>

<script>
import { formatTime } from '../utils/utils';

export default {
    data () {
        return {
            starting: false,
            seconds: 0,
            timer: null
        }
    },

    computed: {
        time () {
            return formatTime(this.seconds);
        }
    },

    methods: {
        start () {
            this.starting = true;
            this.timer && window.clearInterval(this.timer);
            this.timer = window.setInterval(() => {
                this.seconds ++;
            }, 1 * 1000);
        },

        stop () {
            this.starting = false;
            this.timer && window.clearInterval(this.timer);
            this.seconds = 0;
        }
    }
}
</script>

<style scoped lang="less">
    @linghtRed: #e74c3c;
    @transparencyRed: rgba(231, 76, 60, .7);
    .timer-wrapper {
        height: 22px;
        line-height: 22px;
        text-align: center;
        span {
            display: inline-block;
            vertical-align: middle;
        }
        .light {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: @linghtRed;
        }
        .flash {
            animation: flash .8s ease-in infinite backwards;
        }
        .time {
            font-size: 12px;
            margin-left: 8px;
        }
        @keyframes flash {
            from {
                box-shadow: 0 0 2px 2px @transparencyRed;
            }
            to {
                box-shadow: 0 0 5px 5px @transparencyRed;
            }
        }
    }
</style>


