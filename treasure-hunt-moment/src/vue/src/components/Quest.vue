<template>
  <div class="quest" :class="{ 'is-correct': quest.correct }">
    <div class="quest-button-wrapper">
      <button class="quest-button" @click="showQuest">
      <span class="quest-button-inner">
        <span class="left"><span class="text">{{ quest.name }}</span></span>
        <span class="icon">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
        </span>
      </span>
      </button>
    </div>
    <popup-overlay ref="questPopup">
      <div class="quest-name">{{ quest.name }}</div>
      <div class="quest-question">{{ quest.question }}</div>
      <a v-if="quest.image && quest.image.length" :href="quest.imageLink" class="quest-image" target="_blank">
        <img :src="quest.image" :alt="quest.name">
      </a>
      <div class="quest-input-group" :class="{ 'is-invalid': inputValid === false, 'is-valid': (inputValid === true || quest.correct) }">
        <input @input="onAnswerChange" :disabled="quest.correct" v-model="quest.answer" type="text" class="quest-input" :placeholder="$t('Type your answer')">
        <div class="invalid-feedback">{{ $t('Your answer is wrong. Try again!') }}</div>
        <div class="valid-feedback">{{ $t('Your answer is correct!') }}</div>
      </div>
      <button @click="submitAnswer" class="button-black quest-submit-button" v-show="!quest.correct">{{ $t('Confirm') }}</button>
      <button @click="hideQuest" class="button-black quest-close-button" v-show="quest.correct">{{ $t('Close') }}</button>
    </popup-overlay>
  </div>
</template>

<script>
import PopupOverlay from './PopupOverlay'
import FuzzySet from 'fuzzyset.js'

export default {
  name: 'Quest',
  components: { PopupOverlay },
  data: function () {
    return {
      fs: undefined,
      inputValid: undefined
    }
  },
  props: {
    quest: {
      type: Object,
      required: true,
      default () {
        return {
          name: 'Quest',
          question: '',
          image: '',
          imageLink: '',
          answers: []
        }
      }
    }
  },
  created () {
    this.fs = FuzzySet(this.quest.answers)
  },
  methods: {
    /**
     * Show the quest popup.
     */
    showQuest () {
      this.$refs.questPopup.show()
    },

    /**
     * Hide the quest popup.
     */
    hideQuest () {
      this.$refs.questPopup.hide()
    },

    /**
     * Handle user input
     */
    onAnswerChange () {
      this.inputValid = undefined // Reset the form
    },

    /**
     * Handle the answer submission
     */
    submitAnswer () {
      const fuzzy = this.fs.get(this.quest.answer, false, 0.75)
      if (fuzzy) {
        this.quest.answer = fuzzy[0][1] // Correct the input with the matched answer
        this.inputValid = true
        this.$set(this.quest, 'correct', true)
        this.$emit('correct-input', this.quest.answer)
      } else {
        this.inputValid = false
      }
    }
  },
  i18n: {
    messages: {
      de: {
        'Type your answer': 'Deine Antwort',
        'Your answer is wrong. Try again!': 'Deine Antwort ist falsch. Versuche es erneut!',
        'Your answer is correct!': 'Deine Antwort ist richtig!',
        Confirm: 'Bestätigen',
        Close: 'Schließen'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../styles/variables";

  .quest-button-wrapper {
    text-align: center;
    margin: 20px 0;
  }

  .quest-button {
    background: #ffffff;
    outline: none;
    padding: 0;
    border: none;
    border-radius: 7px;
    overflow: hidden;

    .quest-button-inner {
      display: flex;
      min-height: 60px;
      width: 250px;
      align-items: stretch;
    }

    .left {
      padding: 18px;
      border-top-left-radius: 7px;
      border-bottom-left-radius: 7px;
      border: 1px solid #f3f3f3;
      border-right: 0;
      flex: 1;
      text-align: left;
    }

    .left .text {
      font-size: 18px;
      font-weight: $font-weight-bold;
      line-height: 24px;
      display: inline-block;
    }

    .icon {
      background: rgba(23, 23, 23, 0.1);
      display: flex;
      align-items: center;
      padding: 0 18px;
      color: rgba(23, 23, 23, 0.1);
      border-top-right-radius: 7px;
      border-bottom-right-radius: 7px;
      border: 1px solid #f3f3f3;
      border-left: 0;
    }

    .icon svg {
      width: 20px;
      height: 20px;
    }
  }

  .quest.is-correct .quest-button .icon {
    background: #34be7e;
    border-color: #34be7e;
    color: #fff;
  }

  .quest-name {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 18px;
  }

  .quest-question {
    margin-bottom: 20px;
    font-size: 21px;
    font-weight: $font-weight-bold;
  }

  .quest-image {
    margin-bottom: 30px;
    display: block;
    outline: none;
  }

  .quest-image img {
    width: 100%;
    height: auto;
  }

  .quest-input-group  {

    .invalid-feedback,
    .valid-feedback {
      font-size: 18px;
      line-height: 28px;
      font-weight: $font-weight-bold;
      display: none;
      margin-top: 10px;
    }

    .invalid-feedback {
      color: #e35656;
    }

    .valid-feedback {
      color: #35bf7f;
    }

    .quest-input {
      width: 100%;
      height: 60px;
      background: rgba(23, 23, 23, 0.05);
      border: 2px solid rgba(23, 23, 23, 0.2);
      border-radius: 7px;
      font-size: 18px;
      font-weight: $font-weight-bold;
      padding-left: 18px;
      padding-right: 18px;
      outline: none;

      &::-webkit-input-placeholder,
      &:-moz-placeholder,
      &:-moz-placeholder,
      &:-ms-input-placeholder {
        color: #171717;
        opacity: 0.5;
      }

      &:focus {
        border-color: #171717;
      }
    }

    // Form data is invalid
    &.is-invalid {
      .invalid-feedback {
        display: block;
      }

      .quest-input {
        border-color: #ea6969;
        color: #ea6969;
      }
    }

    // Form data is valid
    &.is-valid {
      .valid-feedback {
        display: block;
      }

      .quest-input,
      .quest-input:disabled {
        border-color: #34be7e;
        color: #34be7e;
        -webkit-text-fill-color: #34be7e;
        opacity: 1;
      }
    }
  }

  .button-black {
    background: #000;
    color: #fff;
    border: none;
    border-radius: 7px;
    height: 60px;
    width: 100%;
    font-size: 18px;
    font-weight: $font-weight-bold;
    outline: none;
  }

  .quest-submit-button {
    margin-top: 20px;
  }

  .quest-close-button {
    margin-top: 10px;
  }
</style>
