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
    isComplete = true;
  }

  public void done() {
    isBrewing = true;
  }

  protected void declareComplete() {
    isComplete = true;
    ui.complete();
  }

  protected void containerAvailable() {
    hws.resume();
  }

  protected void containerNotAvailable() {
    hws.pause();
  }

  public abstract boolean isReady();
}
