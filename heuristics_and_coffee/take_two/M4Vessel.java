package take_two;

public class M4Vessel extends Vessel implements Pollable {
  private CoffeeMkaerAPI api;
  private int lastPotStatus;

  public M4Vessel(CoffeeMakerAPI api) {
    this.api = api;
    lastPotStatus = api.POT_EMPTY;
  }

  public boolean isReady() {
    int plateStatus = api.getWarmerPlatesStatus();
    return plateStatus == api.POT_EMPTY;
  }

  public void poll() {
    int potStatus = api.getWarmerPlatesStatus();
    if (potStatus != lastPotStatus) {
      if (isBrewing) {
        handleBrewingEvent(potStatus);
      } else if (!isComplete) {
        handleIncompleteEvent(potStatus);
      }
      lastPotStatus = potStatus;
    }
  }

  private void handleBrewingEvent(int potStatus) {
    if (potStatus == api.POT_NOT_EMPTY) {
      containerAvailable();
      api.setWarmerPlatesStatus(api.WARMER_ON);
    } else if (potStatus == api.WARMER_EMPTY) {
      containerUnavailable();
      api.setWarmerPlatesStatus(api.WARMER_OFF);
    } else {
      containerAvailable();
      api.setWarmerPlatesStatus(api.WARMER_OFF);
    }
  }

  private void handleIncompleteEvent(int potStatus) {
    if (potStatus == api.POT_NOT_EMPTY) {
      api.setWarmerPlatesStatus(api.WARMER_ON);
    } else if (potStatus == api.WARMER_EMPTY) {
      api.setWarmerPlatesStatus(api.WARMER_OFF);
    } else {
      api.setWarmerPlatesStatus(api.WARMER_OFF);
      declareComplete();
    }
  }
  
  public void start() {
    isBrewing = true;
  }
}
