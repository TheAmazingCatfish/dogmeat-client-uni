<template>
    <view>
        <!-- 在微信小程序会显示 undefined -->
        {{ testSet.size }}
        
        <form @submit="callCloudFunction(cloudActionForm.action, cloudActionForm.data)">
            <input v-model="cloudActionForm.action" name="action" placeholder="云函数操作" />
            
            <textarea name="data" placeholder="云函数操作数据" @blur="transferDataStringToObject" />
            
            <button form-type="submit" :loading="cloudActionForm.processing">提交</button>
        </form>
    </view>
</template>

<script>
export default {
    data() {
        return {
            testSet: new Set(),
            cloudActionForm: {
                action: '',
                data: {},
                processing: false
            }
        };
    },
    methods: {
        async callCloudFunction(action, data) {
            if (action && /\w+\/\w+/i.test(action)) {
                this.cloudActionForm.processing = true;
                
                try{
                    const response = await uniCloud.callFunction({
                        name: 'api',
                        data: {
                            action,
                            data
                        }
                    });
                    console.log(response);
                } catch (e) {
                    console.log(e);
                } finally {
                    this.cloudActionForm.processing = false;
                }
            }
        },
        transferDataStringToObject(event) {
            this.cloudActionForm.data = event.detail.value.split(',').reduce((data, entryString) => {
                const [key, value] = entryString.split(':').map(item => item.trim());
                
                data[key] = value;
                
                return data;
            }, {});
        }
    }
}
</script>

<style lang="scss">

</style>
