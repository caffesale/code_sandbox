public abstract class HotWaterSource {
  private UserInterface ui;
  private Vessel v;
  protected boolean isBrewing;

  public HotWaterSource() {
    isBrewing = false;
  }

  public void init(UserInterface ui, Vessel v) {
    this.ui = ui;
    this.v = v;
  }

  public void start() {
    isBrewing = true;
    startBrewing();
  }
  
  protected void done() {
    isBrewing = false;
  }

  protected void declareDone() {
    ui.done();
    v.done();
    isBrewing = false;
  }

  public abstract boolean isReady();
  public abstract void startBrewing();
  public abstract void pause();
  public abstract void resume();
}
