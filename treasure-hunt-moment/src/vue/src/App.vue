<template>
  <div id="app" class="app-component" v-bind:style="{ backgroundImage: (data && data.backgroundImage) ? `url(${data.backgroundImage})` : false }">
    <div class="inner" v-if="data && !loading">
      <intro-box ref="introBox" :data="data" :won="won"></intro-box>
      <quest v-for="(quest, index) in data.quests" :quest="quest" v-bind:key="quest.name" v-on:correct-input="markQuestAsCorrect(index, $event)"></quest>
    </div>
    <div class="sponsor-banner" v-if="settings && settings.hasSponsors">
      <p>{{ settings.credit }}</p>
      <div class="logo-container">
        <img v-for="(logo, index) in settings.logos" v-bind:key="index" :src="logo" :alt="index" />
      </div>
    </div>
  </div>
</template>

<script>
import IntroBox from './components/IntroBox'
import Quest from './components/Quest'

export default {
  name: 'App',
  components: { Quest, IntroBox },
  created () {
    this.$SDK.onConfigReceived(this.initialize)
  },
  data: function () {
    return {
      defaultData: {
        backgroundImage: undefined, // The default background color is set in the style section
        prizeImage: './img/default-prize.svg',
        prizeDescriptionHeadline: 'You can win a prize',
        prizeDescriptionText: 'This is a description about the prize that you can win. This is a description about the prize that you can win. This is a description about the prize that you can win. This is a description about the prize that you can win',
        quests: [],
        claimButtonLink: 'https://www.stagecast.io'
      },
      data: undefined,
      settings: undefined,
      won: false,
      loading: true
    }
  },
  methods: {
    /**
     * Initialize the Stagecast Moments SDK
     */
    initialize () {
      this.$SDK.connection.getMomentClass()
        .then((data) => {
          this.$i18n.locale = data.language ? data.language : 'en'
          this.initSettings(data)
          this.initCustomData(data.custom)
          this.initUserState()
            .finally(() => {
              this.loading = false
              this.checkWin()
            })
        })
        .catch((err) => {
          console.error(err) //eslint-disable-line
        })
    },
    initSettings (settings) {
      const fullSettings = Object.assign({}, settings)
      this.settings = {}

      if (fullSettings.showSponsor && fullSettings.sponsor && fullSettings.sponsor.logos && fullSettings.sponsor.logos.length > 0) {
        this.settings.hasSponsors = true
        this.settings.logos = fullSettings.sponsor.logos.map(contentId => this.getImageUrl(contentId))
        this.settings.credit = fullSettings.sponsor.credit
      }
    },
    initCustomData (customData) {
      this.data = Object.assign({}, customData)

      // Check if the keys are set in customData, and use the default values if needed
      if (!this.data.prizeDescriptionHeadline || !this.data.prizeDescriptionHeadline.length) this.data.prizeDescriptionHeadline = this.defaultData.prizeDescriptionHeadline
      if (!this.data.prizeDescriptionText || !this.data.prizeDescriptionText.length) this.data.prizeDescriptionText = this.defaultData.prizeDescriptionText
      if (!this.data.quests || !this.data.quests.length) this.data.quests = this.defaultData.quests
      if (!this.data.claimButtonLink || !this.data.claimButtonLink.length) this.data.claimButtonLink = this.defaultData.claimButtonLink

      if (this.data.backgroundImage && this.data.backgroundImage.length > 0) {
        this.data.backgroundImage = this.getImageUrl(this.data.backgroundImage[0])
      }
      if (!this.data.prizeImage || this.data.prizeImage.length === 0) {
        this.data.prizeImage = this.defaultData.prizeImage
      } else {
        this.data.prizeImage = this.getImageUrl(this.data.prizeImage[0])
      }
      // Add the index as ID to every quest
      for (let i = 0; i < this.data.quests.length; i++) {
        this.data.quests[i].id = i
        this.data.quests[i].answers = this.data.quests[i].answers.split(',').map(s => s.trim())
        this.data.quests[i].image = this.getImageUrl(this.data.quests[i].image[0])
      }
      console.log(this.data) //eslint-disable-line
    },
    getImageUrl (img) {
      return img ? this.$SDK.connection.getContentCdnLocation(img) : ''
    },
    /**
     * Fetch the user state and sync the data.
     */
    initUserState () {
      return this.$SDK.connection.getMomentUserState()
        .then((state) => {
          state.forEach((stateQuest, index) => {
            const quest = this.data.quests[index]
            if (quest && quest.name === stateQuest.name) {
              quest.answer = stateQuest.answer
              quest.correct = true
              this.$set(this.data.quests, index, quest)
            }
          })
          console.log(this.data) //eslint-disable-line
        })
        .catch((err) => {
          console.error(err) //eslint-disable-line
        })
    },
    /**
     * Mark a quest with the index i as correct
     */
    markQuestAsCorrect (i, answer) {
      this.data.quests[i].correct = true
      this.data.quests[i].answer = answer
      this.checkWin()
    },
    /**
     * Check if the user already won
     */
    checkWin () {
      // Check if there aren't any quests NOT marked as true left (This means, the user has won)
      if (this.data && this.data.quests && this.data.quests.filter(q => q.correct !== true).length === 0) {
        this.won = true
        window.setTimeout(() => {
          // Automatically open the prize overlay when the user has won
          this.$refs.introBox.showPrize()
        }, 2000)
      }

      // Get all correct quests, and use just the name and answer in the user state object
      const userState = this.data.quests.filter(q => q.correct === true).map(quest => {
        return {
          id: quest.id,
          name: quest.name,
          answer: quest.answer
        }
      })

      this.$SDK.connection.setMomentUserState(userState)
        .catch(err => {
          console.error(err) //eslint-disable-line
        })
    }
  }
}
</script>

<style lang="scss">
  @import "~normalize.css/normalize.css";
  @import "styles/variables";

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .app-component {
    font-size: $base-font-size;
    line-height: $base-line-height;
    font-family: $base-font-stack;
    color: $base-color;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    width: 100vw;
    min-height: 100vh;
    background: rgb(61,23,239);
    background: linear-gradient(130deg, rgba(61,23,239,1), rgba(109,83,255,1));
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }

  // Clearfix
  .app-component::before,
  .app-component::after {
    content: " ";
    display: table;
    clear: both;
  }

  .app-component > .inner {
    padding: 0 20px;
    width: 100%;
  }

  .sponsor-banner {
    display: block;
    margin-top: auto;
    bottom:0;
    width: 100%;
    background-color: rgba(0,0,0,0.2);
  }

  .sponsor-banner p {
    display: block;
    font-size: 14px;
    color: white;
    text-align: center;
    padding: 12px 0;
    margin: 0;
  }
  .sponsor-banner .logo-container {
    margin-top: 0px;
    padding-bottom: 10px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    /*iOS 10.3 fallback*/
    -webkit-box-justify: space-evenly;
    -moz-box-justify: space-evenly;
    -ms-flex-justify: space-evenly;
    -webkit-justify-content: space-evenly;
    justify-content: space-around;
    /* space-evenly not supported by safari 10.3 */
    flex-wrap: wrap;
  }
  .sponsor-banner .logo-container img {
    align-self: center;
    max-width: 70px;
    max-height: 70px;
    min-width: 0;
    margin: 4px;
  }

</style>
