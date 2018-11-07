<template>
    <!--搜索群申请加入-->
    <div class='g-inherit m-article'>
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">加入群</h1>

        </header>
        <div class='g-body'>
            <img class="icon u-circle" slot="icon" :src="teamInfo && teamInfo.avatar">
            <div>{{teamInfo && teamInfo.name}}</div>
            <div>{{teamDesc}}</div>
            <div class='u-bottom'>
                <button type="primary" @click.native="applyClick">申请加入</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            teamId() {
                return this.$route.params.teamId
            },
            teamInfo() {
                return this.$store.state.searchedTeams.find(team => team.teamId === this.teamId)
            },
            teamDesc() {
                return !this.teamInfo ? '' : `${this.teamInfo.memberNum}人群`
            }
        },
        methods: {
            applyClick() {
                let team = this.$store.state.teamlist.find(team => team.teamId === this.teamId)
                // 查询到该群且该群对自己有效，说明已在群中
                if (team && team.validToCurrentUser) {
                    return
                }
                switch (this.teamInfo.joinMode) {
                    case 'rejectAll':
                        alert('该群禁止任何人加入')
                        break
                    case 'noVerify':
                        this.applyTeam()
                        break
                    case 'needVerify':
                        this.showConfirm()
                        break
                }
            },
            showConfirm() {
                // 请输入验证信息

                this.applyTeam(msg)
            },
            applyTeam(msg) {
                this.$store.dispatch('applyTeam', {
                    teamId: this.teamId,
                    ps: msg || '',
                    done: (error, obj) => {
                        if (error) {
                            alert(error)
                            return
                        }
                        alert(msg ? '申请成功 等待验证' : '已加入群')
                        history.go(-2)
                    }
                })
            }

        }
    }
</script>

<style scoped lang="less">

</style>
