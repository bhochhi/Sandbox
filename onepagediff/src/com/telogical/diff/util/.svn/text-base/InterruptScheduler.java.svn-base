package com.telogical.diff.util;

import java.util.TimerTask;

public class InterruptScheduler
  extends TimerTask {
  Thread target = null;

  public InterruptScheduler(Thread target) {
    this.target = target;
  }

  @Override
  public void run() {
    target.interrupt();
  }
}
