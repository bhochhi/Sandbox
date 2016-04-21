package com.thumb.bhochhi;

import org.junit.Assert;
import org.junit.Test;

public class MainTest {

	
	@Test
	public void testExecutionWithFile(){
		try{
			String[] agrs ={"input.txt"};
			Main.main(agrs);	
		}catch(Exception e){
			Assert.fail();
		}
		
	}
}
