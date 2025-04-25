package take_two;

public class CoffeeMaker {
  public static void main(String[] args) {
    CoffeeMakerAPI api = new CoffeeMakerAPI();

    M4UserInterface ui = new M4UserInterface(api);
    M4HotWaterSource hws = new M4HotWaterSource(api);
    M4Vessel v = new M4Vessel(api);

    ui.init(hws, v);
    hws.init(ui, v);
    v.init(ui, hws);

    while (true) {
      ui.poll();
      hws.poll();
      v.poll();
    }
  }
  
}
