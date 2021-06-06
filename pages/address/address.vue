<template>
    <view class="uni-container">
        <uni-forms ref="form" :modelValue="address" :rules="rules" validate-trigger="submit" err-show-type="toast">
            <uni-forms-item name="consignee" label="收货人" required>
                <uni-easyinput v-model="address.consignee" placeholder="收货人姓名" trim="both" />
            </uni-forms-item>
            
            <uni-forms-item name="mobile" label="手机号码" required>
                <uni-easyinput v-model="address.mobile" placeholder="收货人手机号" trim="both" />
            </uni-forms-item>
            
            <uni-forms-item name="area_code" label="所在地区" required>
                <uni-data-picker
                    v-model="address.area_code"
                    placeholder="省市区县乡镇等"
                    popup-title="请选择所在地区"
                    collection="opendb-city-china"
                    field="code as value, name as text, eq(type, 2) as isleaf"
                    orderby="value asc"
                    self-field="code"
                    parent-field="parent_code"
                    @change="noteDownSelectedLocation"
                ></uni-data-picker>
            </uni-forms-item>
            
            <uni-forms-item name="details" label="详细地址" required>
                <uni-easyinput v-model="address.details" placeholder="街道、小区、房间号等" trim="both" />
            </uni-forms-item>
            
            <uni-forms-item name="alias" label="标签">
                <uni-data-checkbox v-model="address.alias" :localdata="tags" mode="tag" wrap @tap="unselectTag" />
            </uni-forms-item>
            
            <uni-forms-item name="is_default" label="设为默认地址" label-width="95">
                <switch :checked="address.is_default" @change="address.is_default = $event.detail.value" />
            </uni-forms-item>

            <view class="uni-button-group">
                <button v-if="address._id" class="delete plain" @click="deleteAddress">删除</button>
                <button class="submit dogmeat" @click="submit">保存</button>
            </view>
        </uni-forms>
    </view>
</template>

<script>
const db = uniCloud.database();
const dbCollectionName = 'uni-id-address';

export default {
    data() {
        return {
            address: {
                consignee: '',
                mobile: '',
                mobile_area_code: "+86",
                province_code: '',
                city_code: '',
                area_code: '',
                general: '',
                details: '',
                alias: '',
                zip_code: '',
                email: '',
                is_default: false
            },
            formOptions: {},
            rules: {
                "consignee": {
                    "rules": [
                        {
                            "required": true,
                            "errorMessage": "{label}还没填哦~"
                        },
                        {
                            "format": "string"
                        }
                    ],
                    "label": "收货人"
                },
                "alias": {
                    "rules": [
                        {
                            "format": "string"
                        },
                        {
                            "maxLength": 5,
                            "errorMessage": "{label}最多5个字哦~"
                        }
                    ],
                    "label": "标签"
                },
                "mobile": {
                    "rules": [
                        {
                            "required": true,
                            "errorMessage": "别忘了填{label}哦~"
                        },
                        {
                            "format": "string"
                        },
                        {
                            "pattern": "^\\+?[0-9-]{3,20}$",
                            "errorMessage": "{label}输错了吧，要不您再看看~"
                        }
                    ],
                    "label": "手机号"
                },
                "area_code": {
                    "rules": [
                        {
                            "required": true,
                            "errorMessage": "请选择{label}哦~"
                        },
                        {
                            "format": "string"
                        }
                    ],
                    "label": "所在地区"
                },
                "details": {
                    "rules": [
                        {
                            "required": true,
                            "errorMessage": "填一下{label}吧~"
                        },
                        {
                            "format": "string"
                        }
                    ],
                    "label": "详细地址"
                },
                "is_default": {
                    "rules": [{
                        "format": "bool"
                    }],
                    "defaultValue": false,
                    "label": "默认地址"
                }
            },
            tags: [
                { value: '家', text: '家' },
                { value: '公司', text: '公司' },
                { value: '学校', text: '学校' }
            ],
            
            // uni-data-checkbox 单选模式没有反选功能，所以记录上次点选的标签，用于反选
            lastSelectedTag: '',
            eventChannel: null
        }
    },
    onLoad(query) {
        uni.setNavigationBarTitle({
            title: (!!query.id ? '编辑' : '新建') + '收货地址'
        });
        
        this.eventChannel = this.getOpenerEventChannel();
        
        if (query.id) {
            this.eventChannel.on('passAddressData', (address) => {
                // console.log(address);
                Object.assign(this.address, address);
            });
        }
    },
    onReady() {
        // this.$refs.form.setRules(this.rules);
    },
    methods: {
        noteDownSelectedLocation(event) {
            const locationInfo = event.detail.value;
            console.log(locationInfo);
            this.address.province_code = locationInfo[0].value;
            this.address.city_code = locationInfo[1].value;
            
            this.address.general = locationInfo.reduce((location, { text }) => location + text, '');
        },
        unselectTag(event) {
            if (this.address.alias === this.lastSelectedTag) {
                this.lastSelectedTag = this.address.alias = '';
            } else {
                this.lastSelectedTag = this.address.alias;
            }
        },
        
        deleteAddress() {
            uni.showModal({
                title: '',
                content: '确定要删除该地址吗',
                cancelText: '取消',
                confirmText: '确定',
                confirmColor: '#DD2D3D',
                success: async res => {
                    if (res.cancel) return;
                    
                    uni.showLoading({
                        mask: true
                    });
                    
                    try {
                        const { deleted } = await this.$request('deleteAddress', this.address._id);
                        
                        uni.showToast({
                            icon: 'success',
                            title: '删除成功'
                        });
                        
                        if (deleted > 0) {
                            setTimeout(() => this.eventChannel.emit('addressDataUpdated'), 400);
                        }
                        setTimeout(() => uni.navigateBack(), 500);
                    } catch (error) {
                        console.log(error);
                    } finally {
                        uni.hideLoading();
                    }
                },
                fail: () => {},
                complete: () => {}
            });
        },
        
        /**
         * 触发表单提交
         */
        async submit() {
            uni.showLoading({
                mask: true
            });
            
            try {
                const validatedAddressData = await this.$refs.form.validate();
                
                try {
                    const action = this.address._id ? 'updateAddress' : 'addAddress';
                    const { id, updated } = await this.$request(action, this.address);
                    
                    // 添加成功会返回 id
                    const title = id ? '添加成功' : '修改成功';
                    uni.showToast({
                        icon: 'success',
                        title
                    });
                    
                    if (id || updated > 0) {
                        setTimeout(() => this.eventChannel.emit('addressDataUpdated'), 400);
                    }
                    setTimeout(() => uni.navigateBack(), 500);
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                uni.showToast({
                    icon: 'none',
                    title: error[0].errorMessage
                });
            } finally {
                uni.hideLoading();
            }
        },

        // submitForm(value) {
        //     // 使用 clientDB 提交数据
        //     db.collection(dbCollectionName).add(value).then((res) => {
        //         uni.showToast({
        //             icon: 'none',
        //             title: '新增成功'
        //         });
        //         this.getOpenerEventChannel().emit('dataUpdated');
        //         setTimeout(() => uni.navigateBack(), 500);
        //     }).catch((err) => {
        //         uni.showModal({
        //             content: err.message || '请求服务失败',
        //             showCancel: false
        //         });
        //     }).finally(() => {
        //         uni.hideLoading();
        //     });
        // }
    }
};
</script>

<style lang="scss">
.uni-container {
    padding: 15px;
}

.uni-input-border,
.uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
}

.uni-input-border {
    padding: 0 10px;
    height: 35px;

}

.uni-textarea-border {
    padding: 10px;
    height: 80px;
}

.uni-button-group {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}

button.delete {
    display: flex;
    align-items: center;
    margin-left: 0;
    margin-right: $uni-spacing-row-lg;
    color: $uni-color-accent;
    font-size: 14px;
    font-weight: 600;
}

button.submit {
    margin-left: 0;
    margin-right: $uni-spacing-row-lg;
    width: 184px;
}
</style>
