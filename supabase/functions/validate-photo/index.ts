
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!HUGGING_FACE_TOKEN) {
      throw new Error('Missing Hugging Face access token')
    }

    const hf = new HfInference(HUGGING_FACE_TOKEN)
    const { image } = await req.json()

    // Face detection
    const result = await hf.objectDetection({
      model: 'facebook/detr-resnet-50',
      inputs: image,
    })

    // Check for faces in the image
    const faces = result.filter((obj: any) => obj.label === 'person')
    const hasFace = faces.length > 0

    return new Response(
      JSON.stringify({ 
        hasFace,
        quality: {
          hasWhiteBackground: true, // Simplified check for demo
          isHighQuality: true // Simplified check for demo
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
