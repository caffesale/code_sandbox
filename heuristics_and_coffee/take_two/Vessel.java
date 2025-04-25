package take_two;

public abstract class Vessel {
  private UserInterface ui;
  private HotWaterSource hws;
  protected boolean isBrewing;
  protected boolean isComplete;

  public Vessel() {
    isBrewing = false;
    isComplete = false;
  }

  public void init(UserInterface ui, HotWaterSource hws) {
    this.ui = ui;
    this.hws = hws;
  }

  public void start() {
    isBrewing = true;
    isComplete = false;
  };

  public void done() {
    isBrewing = false;
  };

  protected void declareComplete() {
    isComplete = true;
    ui.complete();
  }

  protected void containerAvailable() {
    hws.resume();
  }

  protected void containerUnavailable() {
    hws.pause();
  }

  public abstract boolean isReady();
}
