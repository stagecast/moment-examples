<template>
  <div class="intro-box" :class="{ won }">
    <div class="intro-text">{{ won ? $t('Congratulations! You have won a prize.') : $t('Complete all quests and win a prize!') }}</div>
    <button class="prize-button" @click="showPrize">
      <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.2714 5.34488V1.67887H15.8506V0H4.42078V1.67887H0V5.34488C0 8.02789 2.14294 10.215 4.80648 10.2974C5.49736 12.0867 7.06033 13.4507 8.97147 13.8504V15.6323C7.45909 16.0791 6.30414 17.3703 6.05215 18.9547H4.50201V21.3748H15.7696V18.9544H14.2195C13.9675 17.3703 12.8125 16.0791 11.3001 15.6321V13.8501C13.2113 13.4504 14.7745 12.0865 15.4651 10.2972C18.1287 10.2152 20.2714 8.02789 20.2714 5.34488ZM11.2959 4.99267L13.2642 5.57288L12.0129 7.19927L12.039 8.14831L12.0694 9.25077L10.1357 8.56321L8.20222 9.25077L8.23262 8.14831L8.25874 7.19927L7.00737 5.57288L8.97575 4.99267L9.76875 3.83559L10.1357 3.30003L10.5029 3.83582L11.2959 4.99267ZM2.15648 5.34488V3.83559H4.42102V8.09511C3.13212 7.84312 2.15648 6.70646 2.15648 5.34488ZM18.1149 5.34488C18.1149 6.70646 17.139 7.84288 15.8506 8.09511V3.83559H18.1149V5.34488Z" fill="white"/></svg>
      <span>{{ won ? $t('Claim prize') : $t('Prize') }}</span>
    </button>
    <popup-overlay ref="prizeOverlay" class="prize-overlay">
      <div class="win-info" v-if="won">
        {{ $t('Congratulations! You have won a prize.') }}
      </div>
      <div class="prize-infos">
        <div class="prize-image" v-if="data.prizeImage">
          <img :src="data.prizeImage" alt="">
        </div>
        <div class="prize-headline" v-if="data.prizeDescriptionHeadline">
          {{ data.prizeDescriptionHeadline }}
        </div>
        <div class="prize-text" v-if="data.prizeDescriptionText">
          {{ data.prizeDescriptionText }}
        </div>
      </div>
      <div class="claim-prize-overlay" v-if="won">
        <a class="claim-prize-button" :href="data.claimButtonLink" target="_blank">
          <svg class="icon icon-left" width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.579 5.34488V1.67887H16.1582V0H4.7284V1.67887H0.307617V5.34488C0.307617 8.02789 2.45056 10.215 5.11409 10.2974C5.80498 12.0867 7.36795 13.4507 9.27909 13.8504V15.6323C7.76671 16.0791 6.61175 17.3703 6.35977 18.9547H4.80962V21.3748H16.0772V18.9544H14.5271C14.2751 17.3703 13.1201 16.0791 11.6078 15.6321V13.8501C13.5189 13.4504 15.0821 12.0865 15.7728 10.2972C18.4363 10.2152 20.579 8.02789 20.579 5.34488ZM11.6035 4.99267L13.5719 5.57288L12.3205 7.19927L12.3466 8.14831L12.377 9.25077L10.4433 8.56321L8.50984 9.25077L8.54024 8.14831L8.56636 7.19927L7.31498 5.57288L9.28337 4.99267L10.0764 3.83559L10.4433 3.30003L10.8105 3.83582L11.6035 4.99267ZM2.4641 5.34488V3.83559H4.72864V8.09511C3.43974 7.84312 2.4641 6.70646 2.4641 5.34488ZM18.4225 5.34488C18.4225 6.70646 17.4466 7.84288 16.1582 8.09511V3.83559H18.4225V5.34488Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="0.307617" y1="10.6874" x2="20.579" y2="10.6874" gradientUnits="userSpaceOnUse">
                <stop stop-color="#EEC868"/>
                <stop offset="1" stop-color="#E49358"/>
              </linearGradient>
            </defs>
          </svg>
          {{ $t('Claim prize') }}
          <svg class="icon icon-right" width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.2678 19.1097H1.96743V5.78748H10.6378L12.2757 4.14951H1.13752C0.678891 4.14951 0.307617 4.52078 0.307617 4.97941V19.9396C0.307617 20.3982 0.678891 20.7695 1.13752 20.7695H16.0758C16.5345 20.7695 16.9057 20.3982 16.9057 19.9396V8.80135L15.2678 10.4393V19.1097Z" fill="white"/>
            <path d="M20.2473 0H14.2851C13.8265 0 13.4552 0.371274 13.4552 0.829906C13.4552 1.28854 13.8265 1.65981 14.2851 1.65981H18.2599L9.85165 10.0681C9.52406 10.3957 9.52406 10.898 9.85165 11.2256C10.0045 11.3785 10.2229 11.4658 10.4413 11.4658C10.6597 11.4658 10.8563 11.3785 11.031 11.2256L19.4393 2.79547V6.77029C19.4393 7.22892 19.8105 7.60019 20.2692 7.60019C20.7278 7.60019 21.0991 7.22892 21.0991 6.77029V0.829906C21.0772 0.371274 20.706 0 20.2473 0Z" fill="white"/>
          </svg>
        </a>
      </div>
    </popup-overlay>
  </div>
</template>

<script>
import PopupOverlay from './PopupOverlay'

export default {
  name: 'IntroBox',
  components: { PopupOverlay },
  props: {
    data: {
      type: Object,
      required: true
    },
    won: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    /**
     * Open the prize overlay
     */
    showPrize () {
      this.$refs.prizeOverlay.show()
    }
  },
  i18n: {
    messages: {
      de: {
        'Claim prize': 'Preis sichern',
        Prize: 'Preis',
        'Complete all quests and win a prize!': 'Löse alle Quests und gewinne einen Preis!',
        'Congratulations! You have won a prize.': 'Gratuliere! Du hast einen Preis gewonnen.'
      }
    }
  }
}
</script>

<style lang="scss">
  @import "../styles/variables";

  .intro-box {
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    border-radius: 6px;
    padding: 20px 20px 16px 20px;
    border: 1px solid #f3f3f3;
    margin: 38px 0;
    text-align: center;

    .intro-text {
      font-size: 18px;
      font-weight: $font-weight-bold;
      margin-bottom: 17px;
    }

    .prize-button {
      border: none;
      background: mix(#eec868, #e49358, 50%);
      background: linear-gradient(90deg, #eec868 0%, #e49358 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      padding: 7px 15px;
      font-family: $base-font-stack;
      font-size: 18px;
      font-weight: $font-weight-bold;
      line-height: 26px;
      color: #fff;
      outline: none;

      &:active {
        color: #fff !important;
      }

      svg, span {
        vertical-align: middle;
      }

      span {
        display: inline-block;
        margin-left: 30px;
        margin-right: 50px;
      }
    }

    .prize-infos {
      text-align: left;
    }

    .prize-image {
      margin: 20px 0;
    }

    .prize-image img {
      display: block;
      width: 100%;
      height: auto;
    }

    .prize-headline {
      font-weight: $font-weight-bold;
      font-size: 20px;
      line-height: 25px;
      margin: 20px 0;
    }

    .win-info {
      padding: 20px 55px;
      background: linear-gradient(90deg, #eec868 0%, #e49358 100%);
      font-weight: $font-weight-bold;
      font-size: 22px;
      line-height: 28px;
      color: #fff;
      margin: -55px -25px 25px -25px;
    }

    .claim-prize-overlay {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      padding: 30px 25px 21px 25px;
    }

    .claim-prize-button {
      text-decoration: none;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 7px;
      height: 60px;
      line-height: 60px;
      width: 100%;
      font-size: 18px;
      font-weight: $font-weight-bold;
      outline: none;
      display: block;
      position: relative;
      padding: 0 50px;

      &:active {
        color: #fff !important;
      }
    }

    .claim-prize-button .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .claim-prize-button .icon-left {
      left: 25px;
    }

    .claim-prize-button .icon-right {
      right: 25px;
    }

    .prize-overlay .popup-overlay {
      z-index: 100;
    }

    &.won .prize-overlay .popup-overlay {
      padding-bottom: 111px;
    }

  }
</style>
