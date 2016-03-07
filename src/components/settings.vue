<template>
    <div class="row">
        <div class="col-sm-12">
            <div class="message-box  animated" v-if="showMessage" transition="flip" @click="hideMessage">
                {{$t('settings.message')}}
            </div>
        </div>
    </div>
    <div class="row instructions">
        <p>{{$t('settings.instructions')}}</p>  
    </div>
    <div class="row">
        <div class="col-sm-6">
            <form role="form">
                <div class="form-group">
                    <label for="from">{{$t('settings.first_number')}}</label>
                    <input class="form-control" type="text" id="from" v-model="from">
                </div>
                <div class="form-group">
                    <label for="to">{{$t('settings.last_number')}}</label>
                    <input class="form-control" type="text" id="to" v-model="to">
                </div>
                <button class="btn" @click.prevent="start">{{$t('settings.start')}}</button>
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
    .instructions {
        margin: 20px 0;
    }
</style>