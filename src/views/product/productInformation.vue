<template>
    <div class="c-page mar-right produvtlnformation">
        <div class="wrap">
            <div class="crumb">
                <span> <span class="back" @click="$router.go(-1)">机器人设置</span> / 产品信息</span>
            </div>
            <div class="main-content">
                <div class="search">
                    <div class="search-box">
                        <div class="label">ID</div>
                        <div class="input-wrap">{{id}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品名称</div>
                        <div class="input-wrap">{{name}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品类型</div>
                       <!-- &lt;!&ndash;1：拓展功能 2：角色标签 3：AI形象&ndash;&gt;-->
                        <div class="input-wrap" v-if="type === 1">拓展功能</div>
                        <div class="input-wrap" v-else-if="type === 2">角色标签</div>
                        <div class="input-wrap" v-else-if="type === 3">AI形象</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品图标</div>
                        <div class="input-wrap img"><img :src="imgurl" alt=""></div>
                    </div>
                    <div class="search-box" v-for="(item,index) in detail" :key="index">
                        <div class="label">{{item.title}}</div>
                        <div class="input-wrap">{{item.parameter}}</div>
                    </div>
                    <!--<div class="search-box">
                        <div class="label">商品名称</div>
                        <div class="input-wrap">{{name}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品类型</div>
                        &lt;!&ndash;1：拓展功能 2：角色标签 3：AI形象&ndash;&gt;
                        <div class="input-wrap" v-if="type === 1">拓展功能</div>
                        <div class="input-wrap" v-else-if="type === 2">角色标签</div>
                        <div class="input-wrap" v-else-if="type === 3">AI形象</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品图标</div>
                        <div class="input-wrap img"><img :src="imgurl" alt=""></div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品价格</div>
                        <div class="input-wrap">{{total}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">币种</div>
                        <div class="input-wrap">{{currency}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品介绍</div>
                        <div class="input-wrap" v-html="content"></div>
                    </div>
                    <div class="search-box">
                        <div class="label">创建时间</div>
                        <div class="input-wrap">{{createtime}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">修改时间</div>
                        <div class="input-wrap">{{updatetime}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品状态</div>
                        &lt;!&ndash;// 商品状态 1:上架 2:下架&ndash;&gt;
                        <div class="input-wrap" v-if="status === 1">上架</div>
                        <div class="input-wrap" v-else-if="status === 2">下架</div>
                    </div>
                    <div class="search-box">
                        <div class="label">续费金额</div>
                        <div class="input-wrap">{{renewalAmount}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">真实价格USD</div>
                        <div class="input-wrap">{{realTotal}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">真实续费价格USD</div>
                        <div class="input-wrap">{{realRenewTotal}}</div>
                    </div>
                    <div class="search-box">
                        <div class="label">商品英文名称</div>
                        <div class="input-wrap">{{nameen}}</div>
                    </div>-->
                    <div class="search-box">
                        <div class="label">商品英文介绍</div>
                        <div class="input-wrap" v-html="contenten"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        detailId: this.$route.query.detailId,
        id: '',
        name: '',
        type: '',
        total: '',
        imgurl: '',
        currency: '',
        content: '',
        createtime: '',
        updatetime: '',
        status : '',
        renewalAmount : '',
        realTotal : '',
        realRenewTotal: '',
        bigDecimal  : '',
        nameen  : '',
        contenten  : '',
        resultItem: [],
        detail: [
          {
            title: '商品价格',
            parameter: '',
          },
          {
            title: '币种',
            parameter: '',
          },
          {
            title: '商品介绍',
            parameter: '',
          },
          {
            title: '创建时间',
            parameter: '',
          },
          {
            title: '修改时间',
            parameter: '',
          },
          {
            title: '商品状态',
            parameter: '',
          },
          {
            title: '续费金额',
            parameter: '',
          },
          {
            title: '真实价格USD',
            parameter: '',
          },
          {
            title: '真实续费价格USD',
            parameter: '',
          },
          {
            title: '商品英文名称',
            parameter: '',
          }
        ]
      }
    },
    created() {
      this.getDetail()
    },
    mounted() {
    },
    methods: {
      getDetail () {
        if (this.detailId) {
          this.$fetch.post(`/product/darwinSet/getAiProducts?id=${this.detailId}`).then((res) => {
            if (res.msg === '成功') {
              let resultData = res.data.resultData[0]
              let resultItem = []
              for(let i in resultData) {
                if (resultData[i] === null || resultData[i] === "") {
                  resultData[i] = '-'
                }
                resultItem.push(resultData[i])
              }
              this.detail[0].parameter = resultItem[4]
              this.detail[1].parameter = resultItem[5]
              this.detail[2].parameter = resultItem[6]
              this.detail[3].parameter = resultItem[7]
              this.detail[4].parameter = resultItem[8]
              //// 商品状态 1:上架 2:下架
              this.detail[5].parameter = resultItem[9]
              this.detail[6].parameter = resultItem[10]
              this.detail[7].parameter = resultItem[11]
              this.detail[8].parameter = resultItem[12]
              this.detail[9].parameter = resultItem[13]
              this.contenten = resultData.contenten
              this.imgurl = resultData.imgurl
              this.id = resultData.id
              this.name = resultData.name
              this.type = resultData.type
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .wrap{
        .crumb{
            margin-bottom: 0;
            padding-bottom: 22px;
            .back{
                cursor: pointer;
                &:hover{
                    color: #2176ff;
                }
            }
        }
        .main-content{
            width: 100%;
            background-color: @white;
            padding: 0 40px 0 24px;
            .search{
                display: block;
                border-bottom: 0;
                .search-box{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .label{
                        width: 114px;
                        margin-right: 40px;
                    }
                    .input-wrap{
                        p{
                            display: inline;
                        }
                    }
                    .img{
                        width: 40px;
                        height: 40px;
                        img{
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                    }
                }
            }
        }
    }
</style>