<template>
    <div class="row">
        <div class="column-1-2 column-center">
            <div class="message-box font-size-large padding-xsmall animated" v-if="showMessage" transition="flip" @click="hideMessage">
                {{message}}
            </div>
        </div>
        <div class="column-1-2 column-center">
            <form role="form">
                <label for="from">First number</label>
                <input type="text" id="from" placeholder="First number" v-model="from">
                <label for="to">Last number</label>
                <input type="text" id="to" placeholder="Last numbers" v-model="to">
                <label class="control checkbox">
                    <input type="checkbox" name="checkbox" v-model="isTraining">
                    <span class="control-indicator"></span>
                    <span class="control-label">Training Mode</span>
                </label>
                <button class="buttom" @click.prevent="start">Start</button>
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
                to: 10,
                isTraining: false,
                showMessage: false,
                message: ''
            }
        },
        methods: {
            start: function() {
                this.hideMessage();
                var from = parseInt(this.from);
                var to = parseInt(this.to);
                if (from >= to) {
                    this.showMessage = true;
                    this.message = 'First number should be smaller than last number.';
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
                this.message = '';
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