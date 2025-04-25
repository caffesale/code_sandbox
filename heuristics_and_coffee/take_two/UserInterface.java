package take_two;

public abstract class UserInterface {
  private HotWaterSource hws;
  private Vessel v;
  protected boolean isComplete;
  
  public UserInterface() {
    isComplete = true;
  }

  public void init(HotWaterSource hws, Vessel v) {
    this.hws = hws;
    this.v = v;
  }

  public void complete() {
    isComplete = true;
    completeCycle();
  }
  
  protected void startBrewing() {
    if (hws.isReady() && v.isReady()) {
      hws.start(); 
      v.start(); 
    }
  }

  public void done() {};
  public void completeCycle() {};
}
