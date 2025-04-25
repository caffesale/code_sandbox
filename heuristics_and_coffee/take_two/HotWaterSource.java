package take_two;

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
  };

  public void done() {
    isBrewing = false;
  };

  protected void declareDone() {
    ui.done();
    v.done();
    isBrewing = false;
  }

  protected abstract boolean isReady(); 
  protected abstract void startBrewing(); 
  protected abstract void pause(); 
  protected abstract void resume(); 
}
