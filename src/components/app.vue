<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <h1 class="title" v-if="!runningInIframe()">{{$t('app.title')}}</h1>
                <div class="animated" :class="{'fadeIn': !isRunning}" v-show="!isRunning">
                    <settings @started="start"></settings>
                </div>
            </div>
        </div>
        <div class="row animated" v-if="isRunning" :class="{'fadeIn': isRunning}">
            <div class="col-sm-12">
                
                <!-- TIMER -->
                <div class="row">
                    <div class="col-sm-12 text-right">
                        <span v-if="!completed">{{seconds | secToTime}}</span>
                        <span v-else>&nbsp;</span>
                    </div>
                </div>

                <!-- NUMBER PANEL -->
                <div class="row" v-if="!completed">
                    <div class="col-sm-12 text-center">
                        <span class="font-size-xxl">{{numbers[currentIndex]}}</span>
                        <div class="row text-center" v-if="isTraining">
                            {{numberDescription}}
                        </div>
                    </div>
                </div>

                <!-- COMPLETED PANEL -->
                <div class="row" v-if="completed">
                    <div class="col-sm-12 text-center animated" :class="{'bounceInDown': completed}">
                        <div class="row">
                            <div class="col-sm-12 font-size-xxl">
                                {{seconds | secToTime}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 text-center congratulation-message">
                                <div>{{$t('app.message_seconds_per_number', [this.secondsPerNumber])}}</div>
                                <div>{{congratulationMessage}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BUTTONS PANEL -->
                <div class="row">
                    <div class="col-sm-4 col-xs-12">
                        <div class="progress" v-if="numbers.length">
                            <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" :style="{ width: percentage }">&nbsp;</div>
                        </div>
                    </div>
                    <div class="col-sm-4 col-xs-8 nav-buttons">
                        <button class="btn btn-lg" @click="previous">{{$t('app.previous')}}</button>
                        <button class="btn btn-lg" @click="next" :disabled="completed">
                            <span v-if="currentIndex < numbers.length - 1">{{$t('app.next')}}</span>
                            <span v-else>{{$t('app.finish')}}</span>
                        </button>
                    </div>
                    <div class="col-sm-4 col-xs-4">
                        <button class="btn btn-lg pull-right" @click="new" v-if="isRunning">{{$t('app.new')}}</button>
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

    .congratulation-message {
        margin: 0 0 30px 0;
    }

    .progress {
        margin-top: 12px;
    }

    @media screen and (max-width: 1024px) {
        .font-size-xxl { 
            font-size: 15rem; 
        }
    }

    @media screen and (max-width: 768px) {
        .font-size-xxl { 
            font-size: 8rem; 
        }
    }
    
    @media screen and (min-width: 768px) {
        .nav-buttons {
            text-align: center;
        }
    }
</style>