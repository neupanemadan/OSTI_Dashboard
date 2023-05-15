<template>
  <n-row gutter="12">
    <n-col :span="6">
      <n-card title="Inquiries Recieved" hoverable>
        {{inquiries.length}}
      </n-card>
    </n-col>
    <n-col :span="6">
      <n-card title="Total Staff" hoverable>
        {{teams.length}}
      </n-card>
    </n-col>
    <n-col :span="6">
      <n-card title="Total Projects" hoverable>
        {{programmes.length}}
      </n-card>
    </n-col>
    <n-col :span="6">
      <n-card title="Featured Projects" hoverable>
        {{countUpcoming()}}
      </n-card>
    </n-col>
  </n-row>
</template>
<script>
import { defineComponent, ref} from "vue";
import { mapActions, mapState } from "pinia";
import { teamStore } from "@/store/teams.js";
import { inquiriesStore } from "@/store/inquiries.js";
import { programmeStore } from "@/store/programmes.js";

export default defineComponent({
  computed: {
    ...mapState(inquiriesStore, ["inquiries"]),
    ...mapState(teamStore, ["teams"]),
    ...mapState(programmeStore, ["programmes"]),
  },

  // data() {
  //   const inquiries= ref(null);

  //   return {
  //     inquiries
  //   };
  // },

  methods: {
    ...mapActions(inquiriesStore, ["fetchInquiries"]),
    ...mapActions(teamStore, ["fetchTeams"]),
    ...mapActions(programmeStore, ["fetchProgrammes"]),

  countUpcoming () {
    console.log('------------------999999999999999')
    console.log(this.programmes)
    const featured_programmes = this.programmes.filter(programme => programme.is_featured == true)
    console.log(this.featured_programmes)
    return featured_programmes.length
  }

  },
  mounted() {
    this.fetchInquiries()
    this.fetchTeams()
    this.fetchProgrammes()
  }
});
</script>
<style scoped>
.n-card {
  max-width: 300px;
}
</style>