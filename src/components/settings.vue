<template>
    <div class="row">
        <div class="column-1-2 column-center">
            <div class="message-box font-size-large padding-xsmall animated" v-if="showMessage" transition="flip" @click="hideMessage">
                {{$t('settings.message')}}
            </div>
        </div>
        <div class="column-1-2 column-center">
            <p>{{$t('settings.instructions')}}</p>
            <form role="form">
                <label for="from">{{$t('settings.first_number')}}</label>
                <input type="text" id="from" v-model="from">
                <label for="to">{{$t('settings.last_number')}}</label>
                <input type="text" id="to" v-model="to">
                <!-- <label class="control checkbox">
                    <input type="checkbox" name="checkbox" v-model="isTraining">
                    <span class="control-indicator"></span>
                    <span class="control-label">Treinamento</span>
                </label> -->
                <button class="buttom" @click.prevent="start">{{$t('settings.start')}}</button>
            </form>
        </div>
    </div>
</template>

<script>
    module.exports = {
        transitions: {
            flip: {
                enterClass: 'flipInX',
                leaveClass: 'bounceOut', 
            }
        },
        data: function() {
            return {
                from: 0,
                to: 100,
                isTraining: false,
                showMessage: false
            }
        },
        methods: {
            start: function() {
                this.hideMessage();
                var from = parseInt(this.from);
                var to = parseInt(this.to);
                if (from >= to) {
                    this.showMessage = true;
                    return;
                }
                this.$dispatch('started', {
                    from: this.from,
                    to: this.to,
                    isTraining: this.isTraining
                });
            },
            hideMessage: function() {
                this.showMessage = false;
            }
        }
    }
</script>

<style>
    .message-box {
        cursor: pointer;
        background: #eee;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
</style>