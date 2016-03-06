<template>
    <div class="container container-xsmall">
        <div class="row">
            <div class="column-1">
                <h1 class="title" v-if="!runningInIframe()">{{$t('app.title')}}</h1>
                <div class="animated" :class="{'fadeIn': !isRunning}" v-show="!isRunning">
                    <settings @started="start"></settings>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="column-1 animated" v-if="isRunning" :class="{'fadeIn': isRunning}">
                <div class="row">
                    <div class="column-1-2 column-offset-1-2">
                        <div class="text-right font-size-large" v-if="!completed">{{seconds | secToTime}}</div>
                        <div class="text-right font-size-large" v-else>&nbsp;</div>
                    </div>
                </div>
                <div class="row" v-if="!completed">
                    <div class="column-1 text-center font-size-xxl">
                        {{numbers[currentIndex]}}
                        <div class="row text-center font-size-medium padding-bottom-medium" v-if="isTraining">
                            {{numberDescription}}
                        </div>
                    </div>
                </div>
                <div class="row" v-if="completed">
                    <div class="column-1 text-center font-size-xxl animated" :class="{'bounceInDown': completed}">
                        <div class="row">
                            <div class="column-1">
                                {{seconds | secToTime}}
                            </div>
                            <div class="column-1 text-center font-size-medium padding-bottom-medium">
                                {{$t('app.message_seconds_per_number', [this.secondsPerNumber])}}<br>
                                {{congratulationMessage}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="column-1-3">
                        <div class="progress background-light-grey padding-xxs" v-if="numbers.length">
                            <div class="background-primary full-height" :style="{ width: percentage }">&nbsp;</div>
                        </div>
                    </div>
                    <div class="column-1-3">
                        <div class="text-center">
                            <button @click="previous">{{$t('app.previous')}}</button>
                            <button @click="next" :disabled="completed">
                                <span v-if="currentIndex < numbers.length - 1">{{$t('app.next')}}</span>
                                <span v-else>{{$t('app.finish')}}</span>
                            </button>
                        </div>
                    </div>
                    <div class="column-1-3">
                        <div class="text-right">
                            <button class="buttom" @click="new" v-if="isRunning">{{$t('app.new')}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Settings from './Settings.vue'
import Numbers from '../utilities/numbers.js'
import BrowserHeler from '../utilities/browser_helper.js'

module.exports = {
    components: {
        settings: Settings
    },
    data: function(){
        return {
            seconds: 0,
            timeoutId: 0,
            isRunning: false,
            completed: false,
            currentIndex: 0,
            isTraining: false,
            numbers: []
        };
    },
    filters: {
        secToTime: function(value) {
            var date = new Date(0, 0, 0, 0, 0, 0, 0);
            date.setSeconds(date.getSeconds() + this.seconds);
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return h + ":" + m + ":" + s;
        }
    },
    computed: {
        percentage: function() {
            return Math.floor((this.currentIndex + 1) * 100 / this.numbers.length) + '%';
        },
        numberDescription: function() {
            return Numbers.getText(this.numbers[this.currentIndex]);
        },
        numbersPerSecond: function() {
            return (this.numbers.length / this.seconds).toFixed(2);
        },
        secondsPerNumber: function() {
            return (this.seconds / this.numbers.length).toFixed(2);  
        },
        congratulationMessage: function() {
            if (this.secondsPerNumber < 1) {
                return this.$t('app.message_less_one');
            }
            else if (this.secondsPerNumber < 1.5) {
                return this.$t('app.message_less_one_half');
            }
            else if (this.secondsPerNumber < 2) {
                return this.$t('app.message_less_two');
            }

            return this.$t('app.message_more_two');
        },
        runningInIframe: function() {
            return BrowserHeler.runningInIframe
        }
    },
    methods: {
        start: function (data) {
            this.generateNumbers(data.from, data.to);
            this.currentIndex = 0;
            this.isRunning = true;
            this.completed = false;
            this.seconds = 0;
            this.isTraining = data.isTraining
            setTimeout(this.timer, 1000);
        },
        new: function() {
            this.isRunning = false;
            this.seconds = 0;
        },
        next: function() {
            if (this.currentIndex < this.numbers.length - 1) {
                this.currentIndex++;
            } else {
                this.finish();
            }
        },
        previous: function() {
            if (this.completed) {
                this.completed = false;
                this.timer();
            } 
            else if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        },
        finish: function() {
            this.completed = true;
        },
        timer: function() {
            if (!this.isRunning || this.completed) {
                clearTimeout(this.timeoutId);
                return;
            }
            this.seconds++;
            this.timeoutId = setTimeout(this.timer, 1000);
        },
        generateNumbers: function(min, max) {
            this.numbers = [];
            var count = max - min;
            while (count >= 0) {
                var number = Math.floor(Math.random() * (max - min + 1)) + parseInt(min);
                if (!this.contains(this.numbers, number)) {
                    this.numbers.push(number);
                    count--;
                }
            }
        },
        contains: function (a, obj) {
            var i = a.length;
            while (i--) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        }
    }
}
</script>

<style>
    h1.title {
        margin-top: 50px;
        padding-bottom: 12px;
        font-weight: 300;
        border-bottom: 1px solid #dedee4;
    }

    button[disabled=disabled], button:disabled {
        background: gray;
        color: white;
        cursor: default;
    }

    .font-size-xxl { 
        font-size: 25rem; 
    }

    @media screen and (max-width: 800px) {
        .font-size-xxl { 
            font-size: 15rem; 
        }
    }

    @media screen and (max-width: 550px) {
        .font-size-xxl { 
            font-size: 8rem; 
        }
    }

    .padding-xxs { 
        padding: 1rem; 
    }

    .progress {
        margin-bottom: 5px;
    }
</style>